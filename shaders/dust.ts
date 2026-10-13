export const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform float uPixelRatio;
attribute float aScale;
attribute float aPhase;
varying float vAlpha;

void main() {
  vec3 p = position;
  p.y = mod(position.y + uProgress * 5.0 + uTime * 0.06 + 6.0, 12.0) - 6.0;
  p.x += sin(uTime * 0.2 + aPhase * 6.2831) * 0.18;
  p.z += cos(uTime * 0.15 + aPhase * 6.2831) * 0.12;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uPixelRatio * (10.0 / -mv.z);
  vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.3 + aPhase * 40.0));
}
`;

export const dustFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float glow = pow(smoothstep(0.5, 0.0, d), 1.8);
  gl_FragColor = vec4(uColor * glow, glow * vAlpha * uOpacity);
}
`;
