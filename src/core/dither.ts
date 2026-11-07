import { reducedMotion } from './store';
import { shades } from './theme';

/**
 * Photographs redrawn with ordered dithering. The image is cropped like object-fit: cover,
 * shrunk to the size of its box divided by the dither pixel, and only the stretched luminance
 * is kept. Thresholding against an 8x8 Bayer matrix happens at paint time, so a theme change
 * (two, three or four shades) repaints from memory instead of decoding anything again.
 *
 * Because every frame is a threshold pass, the picture can be alive: it compiles in dot by dot when it
 * appears (the threshold ramps up) and a pool of light follows the pointer (the threshold drops near it).
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
  /** A pool of light in canvas pixels. `k` eases towards `target` (1 while the pointer is over the picture). */
  lens: { x: number; y: number; k: number; target: number };
  raf: number;
}

const REVEAL_MS = 720;
const REVEAL_STEPS = 18;
const LENS_GAIN = 0.62;

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

function paint(canvas: HTMLCanvasElement, { luma, bias, lens }: Frame) {
  const palette = shades();
  const steps = palette.length - 1;
  const { width, height } = canvas;
  const context = canvas.getContext('2d')!;
  let frame = buffers.get(canvas);
  if (!frame || frame.width !== width || frame.height !== height) {
    frame = context.createImageData(width, height);
    buffers.set(canvas, frame);
  }

  const radius = Math.min(width, height) * 0.42;
  const radiusSquared = radius * radius;
  const lit = lens.k > 0.01;
  const offset = bias * steps;

  for (let y = 0; y < height; y++) {
    const dy = y - lens.y;
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      let stretched = (luma[i] / 255) * steps + offset;
      if (lit) {
        const dx = x - lens.x;
        const d2 = dx * dx + dy * dy;
        if (d2 < radiusSquared) {
          const falloff = 1 - d2 / radiusSquared;
          stretched += LENS_GAIN * lens.k * falloff * falloff * steps;
        }
      }
      stretched = stretched < 0 ? 0 : stretched > steps ? steps : stretched;
      const base = Math.floor(stretched);
      const threshold = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
      const [r, g, b] = palette[Math.min(steps, base + (stretched - base > threshold ? 1 : 0))];
      frame.data[i * 4] = r;
      frame.data[i * 4 + 1] = g;
      frame.data[i * 4 + 2] = b;
      frame.data[i * 4 + 3] = 255;
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

    if (state.reveal) {
      const t = Math.min(1, Math.max(0, (now - state.reveal.start) / state.reveal.duration));
      const eased = 1 - (1 - t) ** 3;
      // Quantised, so the picture arrives in steps like a handheld redrawing, not as a smooth fade.
      state.bias = -(1 - Math.round(eased * REVEAL_STEPS) / REVEAL_STEPS);
      if (t < 1) busy = true;
      else state.reveal = undefined;
    }

    const { lens } = state;
    if (Math.abs(lens.target - lens.k) > 0.01) {
      lens.k += (lens.target - lens.k) * 0.22;
      busy = true;
    } else {
      lens.k = lens.target;
    }

    paint(canvas, state);
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
  const state: Frame = { luma, bias: 0, lens: { x: 0, y: 0, k: 0, target: 0 }, raf: 0 };
  frames.set(canvas, state);
  paint(canvas, state);
}

/** Dither pixels are a few CSS pixels wide: coarse enough to read as a texture, fine enough to read as a photograph. */
const pixelSize = () => (window.devicePixelRatio >= 1.5 ? 2 : 3);

/** The element an image slot is declared on: `data-dither` is the source, the rest is optional. */
export function ditherSlot(slot: HTMLElement) {
  const canvas = slot.querySelector('canvas');
  if (!canvas || !slot.dataset.dither) return Promise.resolve();
  watch(slot);

  // A visible slot is drawn at the size of its box. A hidden one falls back to its declared size.
  const box = slot.getBoundingClientRect();
  const px = pixelSize();
  const measured = box.width > 0 && box.height > 0;
  return dither(canvas, {
    src: slot.dataset.dither,
    width: measured ? Math.max(16, Math.round(box.width / px)) : Number(slot.dataset.w ?? 200),
    height: measured ? Math.max(16, Math.round(box.height / px)) : Number(slot.dataset.h ?? 150),
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
        const box = slot.getBoundingClientRect();
        const canvas = slot.querySelector('canvas');
        if (!canvas || box.width === 0 || box.height === 0) return;
        const px = pixelSize();
        const stale =
          canvas.width !== Math.max(16, Math.round(box.width / px)) || canvas.height !== Math.max(16, Math.round(box.height / px));
        if (stale) void ditherSlot(slot);
      }, 120),
    );
  }).observe(slot);

  const aim = (event: PointerEvent, target: number) => {
    if (event.pointerType !== 'mouse' || reducedMotion) return;
    const canvas = slot.querySelector('canvas');
    const state = canvas && frames.get(canvas);
    if (!canvas || !state) return;
    const box = canvas.getBoundingClientRect();
    state.lens.x = ((event.clientX - box.left) / box.width) * canvas.width;
    state.lens.y = ((event.clientY - box.top) / box.height) * canvas.height;
    state.lens.target = target;
    run(canvas, state);
  };
  slot.addEventListener('pointermove', (event) => aim(event, 1));
  slot.addEventListener('pointerleave', (event) => aim(event, 0));
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
  const state = canvas && frames.get(canvas);
  if (!canvas || !state) return;
  state.reveal = { start: performance.now(), duration: REVEAL_MS };
  state.bias = -1;
  paint(canvas, state);
  run(canvas, state);
}

window.addEventListener('themechange', repaintAll);
