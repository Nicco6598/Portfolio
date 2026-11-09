import { reducedMotion } from './store';
import { shades } from './theme';

/**
 * Photographs redrawn with ordered dithering. The image is cropped like object-fit: cover,
 * shrunk to the size of its box divided by the dither pixel, and only the stretched luminance
 * is kept. Thresholding against an 8x8 Bayer matrix happens at paint time, so a theme change
 * (two, three or four shades) repaints from memory instead of decoding anything again.
 *
 * Because every frame is a threshold pass, the picture can be alive: it compiles in dot by dot when it
 * appears (the threshold ramps up), and a bright band sweeps across it once when the pointer arrives.
 */
const BAYER = (() => {
  const size = 8;
  const matrix = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Bit-interleave x^y and y, lowest coordinate bit most significant: the classic recursive Bayer construction.
      let value = 0;
      for (let bit = 0; bit < 3; bit++) {
        const a = ((x ^ y) >> bit) & 1;
        const b = (y >> bit) & 1;
        value |= (a << (2 * (2 - bit) + 1)) | (b << (2 * (2 - bit)));
      }
      matrix[y * size + x] = value;
    }
  }
  return matrix;
})();

interface Frame {
  luma: Uint8Array;
  /** Added to the luminance (in shades) before thresholding: -1 is a black screen, 0 is the photograph. */
  bias: number;
  reveal?: { start: number; duration: number };
  /** The reveal step last painted, so a frame that would look identical is skipped. */
  step?: number;
  /** A band of light travelling down the picture: `start` in ms, once. */
  sweep?: { start: number; duration: number };
  raf: number;
}

const REVEAL_MS = 720;
const REVEAL_STEPS = 18;
const SWEEP_MS = 420;
const SWEEP_GAIN = 0.55;

const sources = new Map<string, Promise<HTMLImageElement>>();
const lumaCache = new Map<string, Uint8Array>();
const frames = new WeakMap<HTMLCanvasElement, Frame>();
const buffers = new WeakMap<HTMLCanvasElement, ImageData>();

function load(src: string) {
  let image = sources.get(src);
  if (!image) {
    image = new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = src;
    });
    sources.set(src, image);
  }
  return image;
}

function luminance(image: HTMLImageElement, width: number, height: number, focus: string, zoom: number) {
  const scratch = document.createElement('canvas');
  scratch.width = width;
  scratch.height = height;
  const context = scratch.getContext('2d', { willReadFrequently: true })!;
  context.imageSmoothingQuality = 'high';

  // object-fit: cover, with the focal point the CSS would have used.
  const [fx, fy] = focus.split(' ').map((part) => parseFloat(part) / 100);
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
  const sw = width / scale;
  const sh = height / scale;
  context.drawImage(image, (image.naturalWidth - sw) * fx, (image.naturalHeight - sh) * fy, sw, sh, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const luma = new Uint8Array(width * height);
  for (let i = 0; i < luma.length; i++) {
    const value = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
    luma[i] = Math.round(Math.min(1, Math.max(0, (value - 0.5) * 1.25 + 0.5)) * 255);
  }
  return luma;
}

function paint(canvas: HTMLCanvasElement, { luma, bias, sweep }: Frame, now = 0) {
  const palette = shades();
  const steps = palette.length - 1;
  const { width, height } = canvas;
  const context = canvas.getContext('2d')!;
  let frame = buffers.get(canvas);
  if (!frame || frame.width !== width || frame.height !== height) {
    frame = context.createImageData(width, height);
    buffers.set(canvas, frame);
  }
  // One 32-bit write per pixel (little-endian ABGR) instead of four byte writes.
  const pixels = new Uint32Array(frame.data.buffer);
  const packed = palette.map(([r, g, b]) => (255 << 24) | (b << 16) | (g << 8) | r);

  const offset = bias * steps;
  // The band: a few rows tall, eased in and out at its edges, from the top of the picture to the bottom.
  const band = Math.max(6, height * 0.16);
  const centre = sweep ? ((now - sweep.start) / sweep.duration) * (height + band * 2) - band : -1e9;

  for (let y = 0; y < height; y++) {
    const near = Math.abs(y - centre) / band;
    const lift = near < 1 ? SWEEP_GAIN * steps * (1 - near) * (1 - near) : 0;
    const row = y * width;
    const bayer = (y & 7) * 8;
    for (let x = 0; x < width; x++) {
      const i = row + x;
      let stretched = (luma[i] / 255) * steps + offset + lift;
      stretched = stretched < 0 ? 0 : stretched > steps ? steps : stretched;
      const base = Math.floor(stretched);
      const threshold = (BAYER[bayer + (x & 7)] + 0.5) / 64;
      pixels[i] = packed[Math.min(steps, base + (stretched - base > threshold ? 1 : 0))];
    }
  }
  context.putImageData(frame, 0, 0);
}

/** One animation loop per canvas, and only while something is moving. */
function run(canvas: HTMLCanvasElement, state: Frame) {
  if (state.raf) return;
  state.raf = requestAnimationFrame((now) => {
    state.raf = 0;
    let busy = false;
    let dirty = false;

    if (state.reveal) {
      const t = Math.min(1, Math.max(0, (now - state.reveal.start) / state.reveal.duration));
      const eased = 1 - (1 - t) ** 3;
      // Quantised, so the picture arrives in steps like a handheld redrawing, not as a smooth fade.
      const step = Math.round(eased * REVEAL_STEPS);
      state.bias = -(1 - step / REVEAL_STEPS);
      // Most frames land on the step already painted: those cost nothing.
      if (step !== state.step) dirty = true;
      state.step = step;
      if (t < 1) busy = true;
      else state.reveal = undefined;
    }

    if (state.sweep) {
      if (now - state.sweep.start >= state.sweep.duration) state.sweep = undefined;
      else busy = true;
      dirty = true;
    }

    if (dirty) paint(canvas, state, now);
    if (busy) run(canvas, state);
  });
}

export interface DitherOptions {
  src: string;
  width: number;
  height: number;
  focus?: string;
  /** 1 is object-fit: cover; above that the crop closes in on the focal point. */
  zoom?: number;
}

const latest = new WeakMap<HTMLCanvasElement, number>();

export async function dither(canvas: HTMLCanvasElement, { src, width, height, focus = '50% 50%', zoom = 1 }: DitherOptions) {
  const ticket = (latest.get(canvas) ?? 0) + 1;
  latest.set(canvas, ticket);
  const key = `${src}|${width}x${height}|${focus}|${zoom}`;
  let luma = lumaCache.get(key);
  if (!luma) {
    luma = luminance(await load(src), width, height, focus, zoom);
    lumaCache.set(key, luma);
  }
  // A newer draw was asked for while this one was decoding: that one wins.
  if (latest.get(canvas) !== ticket) return;

  const previous = frames.get(canvas);
  if (previous) cancelAnimationFrame(previous.raf);
  canvas.width = width;
  canvas.height = height;
  const state: Frame = { luma, bias: 0, raf: 0 };
  frames.set(canvas, state);
  // A redraw at a new size (a font arriving, a resize) must not cut a reveal short: it carries on.
  if (previous?.reveal) {
    state.reveal = previous.reveal;
    state.bias = previous.bias;
    paint(canvas, state);
    run(canvas, state);
    return;
  }
  paint(canvas, state);
}

/** Dither pixels are a few CSS pixels wide: coarse enough to read as a texture, fine enough to read as a photograph. */
const pixelSize = () => (window.devicePixelRatio >= 1.5 ? 2 : 3);

/** The Studio skin shows the photograph as it is: drawn once at device resolution, nothing running afterwards. */
const photoMode = () => document.documentElement.dataset.skin === 'studio';

/** The canvas size a slot wants right now: its box in dither pixels, or in device pixels for a plain photo. */
function wanted(slot: HTMLElement): { width: number; height: number } | undefined {
  const box = slot.getBoundingClientRect();
  if (box.width === 0 || box.height === 0) return undefined;
  if (photoMode()) {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    return { width: Math.round(box.width * scale), height: Math.round(box.height * scale) };
  }
  const px = pixelSize();
  return { width: Math.max(16, Math.round(box.width / px)), height: Math.max(16, Math.round(box.height / px)) };
}

async function photo(canvas: HTMLCanvasElement, slot: HTMLElement, size: { width: number; height: number }) {
  const ticket = (latest.get(canvas) ?? 0) + 1;
  latest.set(canvas, ticket);
  const image = await load(slot.dataset.dither!);
  if (latest.get(canvas) !== ticket) return;

  const old = frames.get(canvas);
  if (old) cancelAnimationFrame(old.raf);
  frames.delete(canvas);
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext('2d')!;
  context.imageSmoothingQuality = 'high';
  const [fx, fy] = (slot.dataset.focus ?? '50% 50%').split(' ').map((part) => parseFloat(part) / 100);
  const zoom = slot.dataset.zoom ? Number(slot.dataset.zoom) : 1;
  const scale = Math.max(size.width / image.naturalWidth, size.height / image.naturalHeight) * zoom;
  const sw = size.width / scale;
  const sh = size.height / scale;
  context.drawImage(image, (image.naturalWidth - sw) * fx, (image.naturalHeight - sh) * fy, sw, sh, 0, 0, size.width, size.height);
}

/** The element an image slot is declared on: `data-dither` is the source, the rest is optional. */
export function ditherSlot(slot: HTMLElement) {
  const canvas = slot.querySelector('canvas');
  if (!canvas || !slot.dataset.dither) return Promise.resolve();
  watch(slot);

  // A visible slot is drawn at the size of its box. A hidden one falls back to its declared size.
  const size = wanted(slot);
  if (size && photoMode()) return photo(canvas, slot, size);
  return dither(canvas, {
    src: slot.dataset.dither,
    width: size?.width ?? Number(slot.dataset.w ?? 200),
    height: size?.height ?? Number(slot.dataset.h ?? 150),
    focus: slot.dataset.focus,
    zoom: slot.dataset.zoom ? Number(slot.dataset.zoom) : 1,
  });
}

/**
 * The canvas is cropped like object-fit: cover, so a box that changes shape after the draw (a font arriving,
 * a resized window) would show a zoomed crop. Each drawn slot is watched and redrawn at its new size once it
 * settles. The same watch hands the pointer to the picture: light follows the mouse.
 */
const watched = new WeakSet<HTMLElement>();
const settle = new WeakMap<HTMLElement, number>();

function watch(slot: HTMLElement) {
  if (watched.has(slot)) return;
  watched.add(slot);

  new ResizeObserver(() => {
    window.clearTimeout(settle.get(slot));
    settle.set(
      slot,
      window.setTimeout(() => {
        const canvas = slot.querySelector('canvas');
        const size = wanted(slot);
        if (!canvas || !size) return;
        if (canvas.width !== size.width || canvas.height !== size.height) void ditherSlot(slot);
      }, 120),
    );
  }).observe(slot);

  // One pass of light when the mouse arrives; nothing runs while it stays or moves.
  slot.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || reducedMotion) return;
    const canvas = slot.querySelector('canvas');
    const state = canvas && frames.get(canvas);
    if (!canvas || !state || state.sweep || state.reveal) return;
    state.sweep = { start: performance.now(), duration: SWEEP_MS };
    run(canvas, state);
  });
}

/** Decodes a slot's photograph ahead of time, without drawing anything. */
export function preload(slot: HTMLElement) {
  if (slot.dataset.dither) load(slot.dataset.dither).catch(() => undefined);
}

/** Repaints every drawn canvas with the current theme. */
export function repaintAll() {
  document.querySelectorAll<HTMLCanvasElement>('[data-dither] canvas').forEach((canvas) => {
    const state = frames.get(canvas);
    if (state) paint(canvas, state);
  });
}

/** The picture compiles in: dots appear from the lights down to the shadows, in steps. */
export function scanIn(element: HTMLElement) {
  if (reducedMotion) return;
  const canvas = element.querySelector('canvas');
  if (!canvas) return;
  if (photoMode()) {
    canvas.animate({ opacity: [0, 1] }, { duration: 360, easing: 'ease-out' });
    return;
  }
  const state = frames.get(canvas);
  if (!state) return;
  state.reveal = { start: performance.now(), duration: REVEAL_MS };
  state.bias = -1;
  state.step = 0;
  paint(canvas, state);
  run(canvas, state);
}

window.addEventListener('themechange', repaintAll);

// A new skin may draw photographs another way: redraw what is on screen, the rest redraws when it is shown.
window.addEventListener('skinchange', () => {
  document.querySelectorAll<HTMLElement>('[data-dither]').forEach((slot) => {
    if (slot.getBoundingClientRect().width > 0) void ditherSlot(slot);
  });
});
