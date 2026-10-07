import gsap from 'gsap';
import { createCable, type CablePose } from './cable';

/**
 * The WebGL stage, loaded on demand so the page never waits for it to show text.
 * It reads the shared state the page writes (scroll progress, section fade) and draws.
 */

export interface StageState {
  progress: number;
  target: number;
  /** 0..1: the rope's entrance, from falling into view to resting in place. */
  intro: number;
  fade: number;
  fadeTarget: number;
  offsetTarget: number;
  /** False while no block that shows the rope is on screen: nothing is drawn. */
  active: boolean;
  blueprint: boolean;
}

const LOOP_SECONDS = 26;
/** Camera distance from the origin, looking down -z. */
const FOCUS = 6.5;
/** Vertical field of view, degrees. */
const FOV = 35;
const NEAR = 0.1;
const FAR = 100;
/** Drawing-buffer budget: past this many pixels the canvas renders at a lower ratio. */
const PIXEL_BUDGET = 3.2e6;

export function mountStage(canvas: HTMLCanvasElement, stage: StageState, options: { debug: boolean; reducedMotion: boolean }) {
  // Transparent canvas: the studio backdrop is a CSS gradient behind it.
  const gl = canvas.getContext('webgl2', {
    antialias: true,
    alpha: true,
    premultipliedAlpha: true,
    depth: true,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!gl) throw new Error('WebGL2 unavailable');
  let cable = createCable(gl);
  let paper = '#f1eee8';

  const pose: CablePose = { progress: 0, loop: 0, tiltX: 0, tiltY: 0, halfWidth: 3, scale: 1, offsetY: 0 };

  // Column-major perspective projection; only the aspect term changes on resize.
  const projection = new Float32Array(16);
  const focal = 1 / Math.tan(((FOV / 2) * Math.PI) / 180);
  projection[5] = focal;
  projection[10] = (FAR + NEAR) / (NEAR - FAR);
  projection[11] = -1;
  projection[14] = (2 * FAR * NEAR) / (NEAR - FAR);

  let dprCap = 2;
  let pixelRatio = 1;
  const resize = () => {
    const width = innerWidth;
    const height = innerHeight;
    const budgetRatio = Math.sqrt(PIXEL_BUDGET / (width * height));
    pixelRatio = Math.max(1, Math.min(devicePixelRatio, dprCap, budgetRatio));
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const aspect = width / height;
    projection[0] = focal / aspect;
    pose.halfWidth = (FOCUS / focal) * aspect;
    pose.scale = Math.min(Math.max(aspect * 1.2, 0.58), 1);
  };
  resize();
  window.addEventListener('resize', resize);

  // The GPU can be taken away (driver reset, too many tabs): stop drawing, rebuild on return.
  let lost = false;
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    lost = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    cable = createCable(gl);
    cable.setPaper(paper);
    resize();
    lost = false;
  });

  // Pointer: the coil leans towards it, a little.
  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  });

  const fps = document.querySelector<HTMLOutputElement>('.fps');
  if (fps) fps.hidden = !options.debug;
  let frames = 0;
  let fpsClock = 0;
  let slowFrames = 0;
  let measuredFrames = 0;
  let started = 0;

  const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);
  let elapsed = 0;
  const rest = { offsetY: 0, tiltX: 0, tiltY: 0 };
  let lastOpacity = -1;
  let visible = true;

  gsap.ticker.add((time, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 1 / 20);
    if (!started) started = time;

    // Scroll progress is tracked even while nothing is drawn, so the rope is never stale on return.
    stage.progress += (stage.target - stage.progress) * damp(14, dt);
    pose.progress = stage.progress;

    // Nothing to draw: hide the canvas too, or it would keep showing its last frame.
    const drawing = stage.active || stage.blueprint;
    if (drawing !== visible) {
      visible = drawing;
      canvas.style.visibility = drawing ? '' : 'hidden';
    }
    if (!drawing || lost) return;

    if (!options.reducedMotion) elapsed += dt;
    pose.loop = ((elapsed / LOOP_SECONDS) * Math.PI * 2) % (Math.PI * 2);
    rest.offsetY += (stage.offsetTarget - rest.offsetY) * damp(2.5, dt);
    rest.tiltX += (-pointer.y * 0.16 - rest.tiltX) * damp(2.2, dt);
    rest.tiltY += (pointer.x * 0.26 - rest.tiltY) * damp(2.2, dt);

    // Entrance: the coil drops in from above, tipped towards the camera, and settles.
    // Rigid motion only, so the no-intersection guarantee of the path still holds.
    const settle = 1 - Math.pow(1 - stage.intro, 4);
    const away = 1 - settle;
    pose.offsetY = rest.offsetY + away * 1.1;
    pose.tiltX = rest.tiltX - away * 0.9;
    pose.tiltY = rest.tiltY + away * 0.25;

    stage.fade += (stage.fadeTarget - stage.fade) * damp(3, dt);
    // Section fades happen on the compositor, on the whole canvas, never inside the rope.
    const appear = Math.min(stage.intro / 0.35, 1);
    const opacity = Math.round(stage.fade * appear * appear * 1000) / 1000;
    if (opacity !== lastOpacity) {
      canvas.style.opacity = String(opacity);
      lastOpacity = opacity;
    }

    if (opacity > 0.002 || stage.blueprint) {
      cable.update(pose);
      cable.draw(projection, FOCUS);
    }

    // Adaptive resolution: if frames keep running long, drop the drawing-buffer ratio once.
    if (time - started > 1.5 && dprCap > 1) {
      measuredFrames++;
      if (deltaMs > 22) slowFrames++;
      if (measuredFrames === 180) {
        if (slowFrames > 30) {
          dprCap = 1;
          resize();
        }
        measuredFrames = 0;
        slowFrames = 0;
      }
    }

    if (options.debug && fps) {
      frames++;
      fpsClock += deltaMs;
      if (fpsClock >= 500) {
        fps.value = `${Math.round((frames * 1000) / fpsClock)} fps · dpr ${pixelRatio.toFixed(2)}`;
        frames = 0;
        fpsClock = 0;
      }
    }
  });

  if (options.debug) Object.assign(window, { __lab: { gl, stage, pose, projection } });

  return {
    setBlueprint(on: boolean) {
      paper = on ? '#7ab0ff' : '#f1eee8';
      cable.setPaper(paper);
    },
  };
}
