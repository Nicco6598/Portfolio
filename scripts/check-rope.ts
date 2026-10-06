/**
 * Proves the rope never passes through itself: for every pose across the pull and the
 * idle loop, any two parts of the centreline that are far apart along the rope must be
 * at least one rope thickness apart in space.
 * Run with: npm run check:rope
 */
import { ROPE_RADIUS, solveRope, type RopePose } from '../src/stage/rope-path.ts';

const SAMPLES = 900;
const out = new Float32Array(SAMPLES * 4);
const params = new Float32Array(SAMPLES);
const arc = new Float32Array(SAMPLES);

const thickness = 2 * ROPE_RADIUS;
let worst = { gap: Infinity, progress: 0, loop: 0, i: 0, j: 0, aspect: '' };

for (const [aspect, halfWidth, scale] of [['desktop', 3.28, 1], ['phone', 0.95, 0.58]] as const) {
  for (let progress = 0; progress <= 0.62; progress += 0.01) {
    let local = Infinity;
    for (let k = 0; k < 16; k++) {
      const loop = (k / 16) * Math.PI * 2;
      const pose: RopePose = { progress, loop, tiltX: 0, tiltY: 0, halfWidth, scale, offsetY: 0 };
      solveRope(pose, SAMPLES, out, params);

      arc[0] = 0;
      for (let i = 1; i < SAMPLES; i++) {
        const a = (i - 1) * 4;
        const b = i * 4;
        arc[i] = arc[i - 1] + Math.hypot(out[b] - out[a], out[b + 1] - out[a + 1], out[b + 2] - out[a + 2]);
      }

      const need = thickness * scale;
      for (let i = 0; i < SAMPLES; i++) {
        for (let j = i + 1; j < SAMPLES; j++) {
          // Neighbours along the rope are always close; only compare genuinely separate parts.
          if (arc[j] - arc[i] < Math.PI * need) continue;
          const d = Math.hypot(out[j * 4] - out[i * 4], out[j * 4 + 1] - out[i * 4 + 1], out[j * 4 + 2] - out[i * 4 + 2]);
          const gap = d / need;
          if (gap < local) local = gap;
          if (gap < worst.gap) worst = { gap, progress, loop, i, j, aspect };
        }
      }
    }
    if (process.env.VERBOSE) console.log(aspect, progress.toFixed(2), (local * 100).toFixed(0) + '%');
  }
}

const ok = worst.gap >= 1;
console.log(
  `${ok ? 'OK' : 'INTERSECTS'}: closest approach ${(worst.gap * 100).toFixed(0)}% of rope thickness ` +
    `(${worst.aspect}, progress ${worst.progress.toFixed(2)}, loop ${worst.loop.toFixed(2)}, samples ${worst.i}/${worst.j})`,
);
process.exit(ok ? 0 : 1);
