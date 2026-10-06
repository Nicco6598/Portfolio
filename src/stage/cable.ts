import * as THREE from 'three';
import { ROPE_RADIUS, solveRope, type RopePose } from './rope-path';

/**
 * A laid rope of nine satin strands with one yellow tracer, like a nautical line.
 * At rest it lies in loose overlapping loops, strands twisted tight: complex work.
 * Pulled, the loops tighten and vanish one by one, as rope really does; then the lay
 * unwinds and the strands settle into nine clear parallel lanes, and the tracer takes
 * its own track: the switch.
 *
 * The centreline, its rotation-minimising frames and the arc length are solved on the
 * CPU each frame (900 samples, well under a millisecond) and handed to the GPU as two
 * 900×1 float textures. The vertex shader winds each strand around that centreline
 * and sweeps a small ring along it: ~89k opaque vertices, one draw call, no noise.
 * The path itself lives in rope-path.ts.
 */

export const STRANDS = 9;
const TRACER = 0;
const SAMPLES = 900;
const RADIAL = 10;
/** One extra vertex closes each ring, so nothing interpolates across the seam. */
const RING = RADIAL + 1;
const TAU = Math.PI * 2;

export type CablePose = RopePose;

const VERTEX = /* glsl */ `
uniform sampler2D uPos;   // xyz centreline, w how settled (0 knotted, 1 taut)
uniform sampler2D uFrame; // xyz frame normal, w arc length from the left end
uniform float uLength;
uniform float uLay;       // length of one full turn of the lay
uniform float uBundle;    // radius at which strands wind around the centreline
uniform float uRadiusKnot;
uniform float uRadiusTaut;
uniform float uSpacing;
uniform float uThickness; // follows the knot size, so the rope keeps its proportions on phones

attribute float aSample;
attribute float aAngle;
attribute float aIndex;
attribute float aLane;
attribute float aAccent;
attribute float aTone;

varying vec3 vNormal;
varying vec3 vRadial;
varying vec3 vLaneNormal;
varying vec3 vViewPosition;
varying float vFibre;
varying float vSettled;
varying float vAccent;
varying float vTone;

const float TAU = 6.28318530718;

void main() {
  int i = int(aSample);
  vec4 here = texelFetch(uPos, ivec2(i, 0), 0);
  vec3 prev = texelFetch(uPos, ivec2(max(i - 1, 0), 0), 0).xyz;
  vec3 next = texelFetch(uPos, ivec2(min(i + 1, ${SAMPLES - 1}), 0), 0).xyz;
  vec4 frame = texelFetch(uFrame, ivec2(i, 0), 0);

  vec3 tangent = normalize(next - prev);
  vec3 normal = normalize(frame.xyz - tangent * dot(frame.xyz, tangent));
  vec3 binormal = cross(tangent, normal);

  float settled = here.w;
  float arc = frame.w;

  // The lay: each strand winds around the centreline. The pitch stays fixed; as the rope
  // settles the helix relaxes in amplitude, like a spring, until every strand lies in its lane.
  float turn = TAU / uLay;
  float theta = aIndex * TAU / ${STRANDS}.0 + arc * turn;
  vec3 radial = normal * cos(theta) + binormal * sin(theta);
  vec3 offset = mix(radial * uBundle, normal * aLane * uSpacing, settled) * uThickness;

  vec3 centre = here.xyz + offset;
  centre.y -= aAccent * smoothstep(0.64, 0.9, arc / uLength) * 0.62 * settled;

  // Each strand has its own tangent along the helix; build its ring around that.
  vec3 swirl = (-normal * sin(theta) + binormal * cos(theta)) * uBundle * uThickness * turn * (1.0 - settled);
  vec3 strandTangent = normalize(tangent + swirl);
  vec3 ringX = normalize(radial - strandTangent * dot(radial, strandTangent));
  vec3 ringY = cross(strandTangent, ringX);
  vec3 surfaceNormal = ringX * cos(aAngle) + ringY * sin(aAngle);

  float radius = mix(uRadiusKnot, uRadiusTaut, settled) * uThickness;
  vec4 mvPosition = modelViewMatrix * vec4(centre + surfaceNormal * radius, 1.0);

  mat3 toView = mat3(viewMatrix);
  vNormal = normalize(toView * surfaceNormal);
  vRadial = normalize(toView * radial);
  vLaneNormal = normalize(toView * normal);
  vViewPosition = mvPosition.xyz;
  // Fine twisted fibres on every strand: a diagonal groove pattern along its length.
  vFibre = arc * 150.0 + aAngle * 3.0;
  vSettled = settled;
  vAccent = aAccent;
  vTone = aTone;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uPaper;
uniform vec3 uSignal;

varying vec3 vNormal;
varying vec3 vRadial;
varying vec3 vLaneNormal;
varying vec3 vViewPosition;
varying float vFibre;
varying float vSettled;
varying float vAccent;
varying float vTone;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPosition);
  float nv = max(dot(n, v), 0.0);
  float groove = sin(vFibre);

  vec3 albedo = mix(uPaper * vTone, uSignal, vAccent);

  // Studio: a large soft key from top-left, a cool fill from the right, a softbox to reflect.
  vec3 key = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 fill = normalize(vec3(0.85, -0.15, 0.4));
  float keyLight = clamp((dot(n, key) + 0.35) / 1.35, 0.0, 1.0);
  keyLight *= keyLight;
  float fillLight = max(dot(n, fill), 0.0);

  // Strands shade each other: inside the lay, and side by side once in lanes.
  float inward = max(dot(n, -normalize(vRadial)), 0.0) * (1.0 - vSettled);
  float sideways = abs(dot(n, normalize(vLaneNormal))) * vSettled;
  float occlusion = (1.0 - 0.7 * pow(inward, 1.4)) * (1.0 - 0.22 * sideways * sideways);
  occlusion *= 0.9 + 0.1 * groove;

  vec3 diffuse = albedo * (0.05 + keyLight * 1.1 + fillLight * vec3(0.12, 0.14, 0.17)) * occlusion;

  // Satin: a broad soft highlight broken by the fibres, plus a fabric sheen at grazing angles.
  vec3 h = normalize(key + v);
  float specular = pow(max(dot(n, h), 0.0), 36.0) * 0.32 * (0.6 + 0.4 * groove) * occlusion;
  float sheen = pow(1.0 - nv, 4.0) * 0.28;

  vec3 r = reflect(-v, n);
  float softbox = pow(max(dot(r, normalize(vec3(-0.35, 0.55, 0.75))), 0.0), 24.0);
  float horizon = smoothstep(-0.3, 0.9, r.y);
  float fresnel = 0.04 + 0.96 * pow(1.0 - nv, 5.0);
  vec3 environment = (vec3(0.02) + vec3(0.2) * horizon + vec3(1.4) * softbox) * fresnel * occlusion;

  vec3 color = diffuse + vec3(specular) + albedo * sheen * occlusion + environment;

  // Depth haze: the rope dims as it runs away from the camera.
  float haze = smoothstep(-13.0, -5.5, vViewPosition.z);
  color *= mix(0.35, 1.0, haze);

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function createCable() {
  // Base tube: SAMPLES rings of RING vertices (the last one repeats the first at 2π).
  const geometry = new THREE.InstancedBufferGeometry();
  const sampleAttr = new Float32Array(SAMPLES * RING);
  const angleAttr = new Float32Array(SAMPLES * RING);
  for (let s = 0; s < SAMPLES; s++) {
    for (let a = 0; a < RING; a++) {
      sampleAttr[s * RING + a] = s;
      angleAttr[s * RING + a] = (a / RADIAL) * TAU;
    }
  }

  const index: number[] = [];
  for (let s = 0; s < SAMPLES - 1; s++) {
    for (let a = 0; a < RADIAL; a++) {
      const a0 = s * RING + a;
      const a1 = a0 + 1;
      const b0 = a0 + RING;
      const b1 = a1 + RING;
      // Wound so the outward faces are front faces.
      index.push(a0, a1, b0, a1, b1, b0);
    }
  }

  geometry.setIndex(index);
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SAMPLES * RING * 3), 3));
  geometry.setAttribute('aSample', new THREE.BufferAttribute(sampleAttr, 1));
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angleAttr, 1));

  const strandIndex = new Float32Array(STRANDS);
  const lane = new Float32Array(STRANDS);
  const accent = new Float32Array(STRANDS);
  const tone = new Float32Array(STRANDS);
  const tones = [1, 0.93, 0.97, 0.9, 1, 0.95, 0.91, 0.98, 0.94];
  for (let i = 0; i < STRANDS; i++) {
    strandIndex[i] = i;
    lane[i] = i - (STRANDS - 1) / 2;
    accent[i] = i === TRACER ? 1 : 0;
    // Barely-there variation between strands, so the lay reads as fibre, not plastic.
    tone[i] = tones[i];
  }
  geometry.setAttribute('aIndex', new THREE.InstancedBufferAttribute(strandIndex, 1));
  geometry.setAttribute('aLane', new THREE.InstancedBufferAttribute(lane, 1));
  geometry.setAttribute('aAccent', new THREE.InstancedBufferAttribute(accent, 1));
  geometry.setAttribute('aTone', new THREE.InstancedBufferAttribute(tone, 1));
  geometry.instanceCount = STRANDS;

  const positions = new Float32Array(SAMPLES * 4);
  const frames = new Float32Array(SAMPLES * 4);
  const positionTexture = new THREE.DataTexture(positions, SAMPLES, 1, THREE.RGBAFormat, THREE.FloatType);
  const frameTexture = new THREE.DataTexture(frames, SAMPLES, 1, THREE.RGBAFormat, THREE.FloatType);

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uPos: { value: positionTexture },
      uFrame: { value: frameTexture },
      uLength: { value: 1 },
      uLay: { value: 0.55 },
      // Bundle + strand radius = ROPE_RADIUS, the thickness scripts/check-rope.ts verifies.
      uBundle: { value: ROPE_RADIUS - 0.02 },
      uRadiusKnot: { value: 0.02 },
      uRadiusTaut: { value: 0.016 },
      uSpacing: { value: 0.085 },
      uThickness: { value: 1 },
      uPaper: { value: new THREE.Color('#f1eee8') },
      uSignal: { value: new THREE.Color('#f5b700') },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;

  // Scratch buffers, reused every frame: no allocation in the loop.
  const params = new Float32Array(SAMPLES);
  const tangents = new Float32Array(SAMPLES * 3);
  const normals = new Float32Array(SAMPLES * 3);

  function update(pose: CablePose) {
    solveRope(pose, SAMPLES, positions, params);

    // Tangents by central difference, arc length by accumulation.
    let arc = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const a = Math.max(i - 1, 0) * 4;
      const b = Math.min(i + 1, SAMPLES - 1) * 4;
      const x = positions[b] - positions[a];
      const y = positions[b + 1] - positions[a + 1];
      const z = positions[b + 2] - positions[a + 2];
      const length = Math.hypot(x, y, z) || 1;
      tangents[i * 3] = x / length;
      tangents[i * 3 + 1] = y / length;
      tangents[i * 3 + 2] = z / length;

      if (i > 0) {
        const p = (i - 1) * 4;
        const q = i * 4;
        arc += Math.hypot(positions[q] - positions[p], positions[q + 1] - positions[p + 1], positions[q + 2] - positions[p + 2]);
      }
      frames[i * 4 + 3] = arc;
    }
    material.uniforms.uLength.value = arc;
    material.uniforms.uThickness.value = pose.scale;

    // Rotation-minimising frames (double reflection): the rope never flips on its own.
    {
      const tx = tangents[0];
      const ty = tangents[1];
      const tz = tangents[2];
      // Start flat to the camera: world up, made orthogonal to the tangent.
      let nx = -ty * tx;
      let ny = 1 - ty * ty;
      let nz = -ty * tz;
      const length = Math.hypot(nx, ny, nz) || 1;
      nx /= length;
      ny /= length;
      nz /= length;
      normals[0] = nx;
      normals[1] = ny;
      normals[2] = nz;
    }

    for (let i = 0; i < SAMPLES - 1; i++) {
      const p = i * 4;
      const q = (i + 1) * 4;
      const v1x = positions[q] - positions[p];
      const v1y = positions[q + 1] - positions[p + 1];
      const v1z = positions[q + 2] - positions[p + 2];
      const c1 = v1x * v1x + v1y * v1y + v1z * v1z || 1e-9;

      const rx = normals[i * 3];
      const ry = normals[i * 3 + 1];
      const rz = normals[i * 3 + 2];
      const tx = tangents[i * 3];
      const ty = tangents[i * 3 + 1];
      const tz = tangents[i * 3 + 2];

      const dr = (2 / c1) * (v1x * rx + v1y * ry + v1z * rz);
      const rLx = rx - dr * v1x;
      const rLy = ry - dr * v1y;
      const rLz = rz - dr * v1z;
      const dt = (2 / c1) * (v1x * tx + v1y * ty + v1z * tz);
      const tLx = tx - dt * v1x;
      const tLy = ty - dt * v1y;
      const tLz = tz - dt * v1z;

      const v2x = tangents[(i + 1) * 3] - tLx;
      const v2y = tangents[(i + 1) * 3 + 1] - tLy;
      const v2z = tangents[(i + 1) * 3 + 2] - tLz;
      const c2 = v2x * v2x + v2y * v2y + v2z * v2z;
      const d2 = c2 > 1e-12 ? (2 / c2) * (v2x * rLx + v2y * rLy + v2z * rLz) : 0;

      normals[(i + 1) * 3] = rLx - d2 * v2x;
      normals[(i + 1) * 3 + 1] = rLy - d2 * v2y;
      normals[(i + 1) * 3 + 2] = rLz - d2 * v2z;
    }

    // Designed twist on top of the natural frame: the lanes lie flat, then take
    // a slow half-turn across the screen once taut.
    for (let i = 0; i < SAMPLES; i++) {
      const t = params[i];
      const lp = positions[i * 4 + 3];
      const knotTwist = 0.45 * Math.sin(TAU * 1.5 * t + pose.loop);
      const tautTwist = (t - 0.5) * 2.3 + 0.22 * Math.sin(pose.loop);
      const angle = knotTwist + (tautTwist - knotTwist) * lp;
      const c = Math.cos(angle);
      const sn = Math.sin(angle);

      const tx = tangents[i * 3];
      const ty = tangents[i * 3 + 1];
      const tz = tangents[i * 3 + 2];
      const nx = normals[i * 3];
      const ny = normals[i * 3 + 1];
      const nz = normals[i * 3 + 2];
      // N' = N cos + (T × N) sin
      frames[i * 4] = nx * c + (ty * nz - tz * ny) * sn;
      frames[i * 4 + 1] = ny * c + (tz * nx - tx * nz) * sn;
      frames[i * 4 + 2] = nz * c + (tx * ny - ty * nx) * sn;
    }

    positionTexture.needsUpdate = true;
    frameTexture.needsUpdate = true;
  }

  return { mesh, uniforms: material.uniforms, update };
}
