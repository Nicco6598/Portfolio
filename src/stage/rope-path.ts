/**
 * The rope's centreline, as plain maths: no three.js, so it can be checked in Node
 * (scripts/check-rope.ts proves no two parts of the rope ever pass through each other).
 *
 * At rest the rope lies in a coil, like a line dropped on a table: a trochoid whose turns
 * overlap, each turn resting on top of the one before. Depth rises steadily along the coil,
 * so wherever two turns cross, the later one is always above, by more than the rope's
 * thickness. Pulled from both ends, the coil stretches like a spring: the pitch grows,
 * the turns open and flatten, and the rope runs straight. Nothing shrinks in place.
 */

export interface RopePose {
  /** 0 = coiled, 1 = pulled taut. */
  progress: number;
  /** Idle loop phase in radians; every idle motion is periodic in it. */
  loop: number;
  tiltX: number;
  tiltY: number;
  /** Half the visible width at z = 0, world units. */
  halfWidth: number;
  /** Size multiplier, smaller on portrait screens. Thickness scales with it. */
  scale: number;
  offsetY: number;
}

const TAU = Math.PI * 2;

/** Rope thickness at scale 1: bundle radius + strand radius, matching the shader. */
export const ROPE_RADIUS = 0.074;

export const TURNS = 4;
/** Radius of each turn relative to the base radius; interpolated smoothly along the coil. */
const TURN_SIZE = [0.82, 1.08, 1.0, 0.76];
const BASE_RADIUS = 0.6;
const REST_PITCH = 0.58;
/** Depth gained per turn at rest: enough for every crossing to clear the rope's thickness. */
const RISE = 0.5;
/** Where the coil sits along the rope. */
const COIL_START = 0.3;
const COIL_END = 0.7;

export function smootherstep(x: number) {
  const p = Math.min(Math.max(x, 0), 1);
  return p * p * p * (p * (p * 6 - 15) + 10);
}

function turnRadius(phase: number) {
  // phase in turns; cosine interpolation between per-turn sizes, eased to 0.6 at the ends
  // so the first and last turn grow out of the straight rope instead of starting full size.
  const f = Math.min(Math.max(phase - 0.5, 0), TURN_SIZE.length - 1);
  const i = Math.floor(f);
  const j = Math.min(i + 1, TURN_SIZE.length - 1);
  const w = (1 - Math.cos(Math.PI * (f - i))) / 2;
  const size = TURN_SIZE[i] + (TURN_SIZE[j] - TURN_SIZE[i]) * w;
  const ends = Math.min(phase, TURNS - phase);
  return size * (0.6 + 0.4 * smootherstep(ends / 0.6));
}

/**
 * Fills `out` (x, y, z, settled per sample) and `params` (path parameter per sample).
 * `settled` drives the second beat in the shader: the lay unwinding into lanes.
 */
export function solveRope(pose: RopePose, samples: number, out: Float32Array, params: Float32Array) {
  const s = pose.scale;
  const p = pose.progress;
  const reach = pose.halfWidth * 1.3;

  // Beat one, the pull: the coil stretches open. Beat two, the release (in the shader).
  const pull = smootherstep((p - 0.02) / 0.55);
  const pitchTaut = (reach * 1.9) / TURNS;
  const pitch = (REST_PITCH * s) * (1 - pull) + pitchTaut * pull;
  const open = Math.pow(1 - pull, 1.15);
  // Depth only needs to clear crossings. A turn can only cross itself or its neighbour
  // while its circumference outruns the pitch; below that, the coil is a plain wave.
  const crossing = (TAU * BASE_RADIUS * s * 1.1 * open) / pitch;
  const rise = RISE * s * smootherstep((crossing - 0.45) / 0.65);

  const baseY = -0.62 * (1 - smootherstep((p - 0.3) / 0.45));
  const rock = 1 - smootherstep((p - 0.15) / 0.5);
  const rockY = (0.22 * Math.sin(pose.loop) + 0.12 + pose.tiltY) * rock;
  const rockX = (0.18 + 0.07 * Math.cos(pose.loop) + pose.tiltX) * rock;
  const cy = Math.cos(rockY);
  const sy = Math.sin(rockY);
  const cx = Math.cos(rockX);
  const sx = Math.sin(rockX);
  const breathe = 1 + 0.035 * Math.sin(pose.loop);

  const coilWidth = TURNS * pitch;
  const coilLeft = -coilWidth / 2;
  const coilRight = coilWidth / 2;
  const leadStart = Math.min(-reach, coilLeft - 0.4);
  const leadEnd = Math.max(reach, coilRight + 0.4);
  const zIn = -(TURNS * rise) / 2;
  const zOut = (TURNS * rise) / 2;

  for (let i = 0; i < samples; i++) {
    const raw = i / (samples - 1);
    // Spend samples where the curve bends: ~2.7x denser through the coil.
    const t = raw + 0.1 * Math.sin(TAU * raw);
    params[i] = t;

    let x: number;
    let y = 0;
    let z: number;

    if (t < COIL_START) {
      const a = t / COIL_START;
      x = leadStart + (coilLeft - leadStart) * a;
      // The lead arrives at the angle the coil leaves: no kink in depth.
      z = zIn - (coilLeft - x) * leadSlope(rise, pitch, s);
    } else if (t > COIL_END) {
      const a = (t - COIL_END) / (1 - COIL_END);
      x = coilRight + (leadEnd - coilRight) * a;
      z = zOut + (x - coilRight) * leadSlope(rise, pitch, s);
    } else {
      const phase = ((t - COIL_START) / (COIL_END - COIL_START)) * TURNS;
      const angle = phase * TAU;
      const r = BASE_RADIUS * s * turnRadius(phase) * open * breathe;
      // Each turn leans a little out of the screen plane, differently, so the coil reads as
      // dropped rather than drawn. Periodic in the idle loop.
      const lean = 0.22 * Math.sin(phase * 1.7 + 0.8 + 0.4 * Math.sin(pose.loop)) * open;
      const lateral = r * (1 - Math.cos(angle));
      x = coilLeft + pitch * phase + r * Math.sin(angle);
      y = lateral * Math.cos(lean);
      z = zIn + rise * phase + lateral * Math.sin(lean);
    }

    y += baseY;

    // Tilt about x first, then swing about y: the straight runs only move in depth.
    const tiltedY = y * cx - z * sx;
    const tiltedZ = y * sx + z * cx;

    const centre = 1 - Math.abs(2 * t - 1);
    const settled = smootherstep((p - 0.56 - centre * 0.1) / 0.3);

    out[i * 4] = x * cy + tiltedZ * sy;
    out[i * 4 + 1] = tiltedY + pose.offsetY;
    out[i * 4 + 2] = -x * sy + tiltedZ * cy;
    out[i * 4 + 3] = settled;
  }
}

/** Depth slope of the straight leads, matching the coil's direction where they meet. */
function leadSlope(rise: number, pitch: number, s: number) {
  const r0 = BASE_RADIUS * s * 0.6;
  return rise / (pitch + TAU * r0);
}
