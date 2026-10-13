import { simplexNoise3D } from './noise';

export const imagePlaneVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Photo plane shader
 *  - CSS-like object-fit: cover with a focal point (uFocus)
 *  - noise-driven ripple / displacement transition between uTex0 → uTex1 (uProgress)
 *  - depth-map parallax that follows the pointer (uDepth*, uPointer)
 *  - RGB shift on scroll velocity
 *  - optional light-refraction caustics (uRefract), rounded corners (uRadius)
 */
export const imagePlaneFragment = /* glsl */ `
precision highp float;

uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform sampler2D uDepth0;
uniform sampler2D uDepth1;
uniform vec2 uRes0;
uniform vec2 uRes1;
uniform vec2 uFocus0;
uniform vec2 uFocus1;
uniform vec2 uPlane;
uniform vec2 uPointer;
uniform float uProgress;
uniform float uTime;
uniform float uVelocity;
uniform float uHover;
uniform float uZoom;
uniform float uDepthStrength;
uniform float uAlpha;
uniform float uRadius;
uniform float uRefract;
uniform float uDim;
uniform float uSeed;

varying vec2 vUv;

${simplexNoise3D}

const float PI = 3.14159265359;
const vec3 GOLD = vec3(0.69, 0.46, 0.15); // #d9b46a in linear space

vec2 cover(vec2 uv, vec2 plane, vec2 img, vec2 focus, float zoom) {
  float rp = plane.x / plane.y;
  float ri = img.x / img.y;
  vec2 s = rp > ri ? vec2(1.0, ri / rp) : vec2(rp / ri, 1.0);
  vec2 o = (1.0 - s) * focus;
  vec2 c = o + s * 0.5;
  return (uv * s + o - c) / zoom + c;
}

vec3 sampleShifted(sampler2D tex, vec2 uv, vec2 shift) {
  return vec3(
    texture2D(tex, uv + shift).r,
    texture2D(tex, uv).g,
    texture2D(tex, uv - shift).b
  );
}

void main() {
  vec2 uv = vUv;
  float p = clamp(uProgress, 0.0, 1.0);
  float wave = sin(p * PI);
  float zoom = uZoom * (1.0 + uHover * 0.04);

  vec2 uvA = cover(uv, uPlane, uRes0, uFocus0, zoom);
  vec2 uvB = cover(uv, uPlane, uRes1, uFocus1, zoom);

  // Depth parallax: near pixels (bright in the depth map) move more with the pointer.
  if (uDepthStrength > 0.0) {
    vec2 par = uPointer * uDepthStrength;
    uvA += par * (texture2D(uDepth0, uvA).r - 0.5);
    uvB += par * (texture2D(uDepth1, uvB).r - 0.5);
  }

  vec2 dir = normalize(uv - 0.5 + 1e-5);
  float d = distance(uv, vec2(0.5));
  float n = 0.5;
  float mask = 0.0;

  // Transition field (noise + distance) — only evaluated while a transition runs.
  if (p > 0.0005 && p < 0.9995) {
    n = snoise(vec3(uv * 2.4, uSeed + uTime * 0.06)) * 0.5 + 0.5;
    float field = n * 0.65 + d * 0.35;
    mask = smoothstep(field - 0.14, field + 0.14, p * 1.3 - 0.15);
    float ring = sin(d * 38.0 - p * 14.0) * 0.006 * wave;
    vec2 disp = (vec2(n, snoise(vec3(uv * 2.4 + 7.3, uSeed))) - 0.5) * 0.14 * wave + dir * ring;
    uvA += disp * p;
    uvB -= disp * (1.0 - p);
  } else if (p >= 0.9995) {
    mask = 1.0;
  }

  // Light refraction band (essence chapter).
  float caustic = 0.0;
  if (uRefract > 0.0) {
    float band = sin((uv.x * 1.4 + uv.y * 0.8) * 5.0 - uTime * 0.35 + d * 3.0);
    caustic = pow(max(band, 0.0), 8.0) * uRefract;
  }

  vec2 shift = vec2(uVelocity * 0.0035, uVelocity * 0.001) + dir * (wave * 0.004 + caustic * 0.006);
  vec3 col;
  if (mask <= 0.0) col = sampleShifted(uTex0, uvA, shift);
  else if (mask >= 1.0) col = sampleShifted(uTex1, uvB, shift);
  else col = mix(sampleShifted(uTex0, uvA, shift), sampleShifted(uTex1, uvB, shift), mask);

  // Champagne glow along the transition front.
  float edge = mask * (1.0 - mask) * 4.0;
  col += GOLD * edge * wave * 0.28;

  vec3 spectrum = 0.5 + 0.5 * cos(6.2831 * (uv.x * 0.8 + uv.y * 0.3 + vec3(0.0, 0.33, 0.67)) + uTime * 0.25);
  col += caustic * (spectrum * 0.09 + GOLD * 0.12);
  col += GOLD * uRefract * 0.05 * smoothstep(0.9, 0.0, distance(uv, vec2(0.85 + 0.1 * sin(uTime * 0.2), 0.15)));

  col *= 1.0 - uDim;

  // Rounded corners.
  vec2 px = uv * uPlane;
  vec2 q = abs(px - uPlane * 0.5) - (uPlane * 0.5 - uRadius);
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float a = 1.0 - smoothstep(-1.0, 1.0, sd);

  gl_FragColor = vec4(col, uAlpha * a);
  #include <colorspace_fragment>
}
`;
