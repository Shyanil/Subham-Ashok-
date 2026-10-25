'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Full-viewport plane that turns a render + its depth map into a 2.5D scene.
 * Everything is in top-left image UVs (0..1). Per frame the caller supplies, via `state`:
 *  - center/zoom: which part of the image fills the view (zoom 1 = object-fit: cover)
 *  - pointer:     −1..1 offset; near pixels (bright in the depth map) shift further than far ones
 *  - mix:         0 = first image, 1 = second (cross-dissolve between two renders)
 */
export type DepthState = {
  center: [number, number][];
  zoom: number;
  pointer: [number, number];
  mix: number;
  strength: number;
  /** Extra UV kept clear of the image edge when clamping the center (default 0.04). */
  margin?: number;
};

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D mapA; uniform sampler2D depthA; uniform vec2 coverA; uniform vec2 centerA;
  uniform sampler2D mapB; uniform sampler2D depthB; uniform vec2 coverB; uniform vec2 centerB;
  uniform float zoom; uniform vec2 pointer; uniform float mixAmt; uniform float strength;
  varying vec2 vUv;

  vec3 shade(sampler2D map, sampler2D depth, vec2 cover, vec2 center) {
    vec2 uv = center + (vUv - 0.5) * cover / zoom;
    // Three-step parallax: re-sample depth at the shifted position so edges smear less.
    vec2 off = vec2(0.0);
    for (int i = 0; i < 3; i++) {
      float d = texture2D(depth, uv + off).r;
      off = pointer * (d - 0.4) * strength * cover / zoom;
    }
    return texture2D(map, clamp(uv + off, 0.001, 0.999)).rgb;
  }

  void main() {
    vec3 a = shade(mapA, depthA, coverA, centerA);
    vec3 b = mixAmt > 0.001 ? shade(mapB, depthB, coverB, centerB) : a;
    gl_FragColor = vec4(mix(a, b, smoothstep(0.0, 1.0, mixAmt)), 1.0);
    #include <colorspace_fragment>
  }
`;

/** UV extent of an image that covers a viewport (object-fit: cover). */
export function coverFor(imageAspect: number, viewAspect: number): [number, number] {
  return viewAspect > imageAspect ? [1, imageAspect / viewAspect] : [viewAspect / imageAspect, 1];
}

/** Keep a view center inside the image so the edges never show. */
export function clampCenter(c: [number, number], cover: [number, number], zoom: number, margin = 0.04): [number, number] {
  const hx = Math.min(0.5, (cover[0] / zoom) * 0.5 + margin);
  const hy = Math.min(0.5, (cover[1] / zoom) * 0.5 + margin);
  return [Math.min(1 - hx, Math.max(hx, c[0])), Math.min(1 - hy, Math.max(hy, c[1]))];
}

type Layer = { map: THREE.Texture; depth: THREE.Texture };

export function DepthPlane({ layers, state, onFrame }: { layers: [Layer] | [Layer, Layer]; state: React.RefObject<DepthState>; onFrame?: (cover: [number, number][]) => void }) {
  const { size } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const [a, b = a] = layers;

  const uniforms = useMemo(() => {
    for (const l of [a, b]) {
      l.map.colorSpace = THREE.SRGBColorSpace;
      for (const t of [l.map, l.depth]) {
        t.flipY = false;
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        t.needsUpdate = true;
      }
    }
    return {
      mapA: { value: a.map }, depthA: { value: a.depth }, coverA: { value: new THREE.Vector2(1, 1) }, centerA: { value: new THREE.Vector2(0.5, 0.5) },
      mapB: { value: b.map }, depthB: { value: b.depth }, coverB: { value: new THREE.Vector2(1, 1) }, centerB: { value: new THREE.Vector2(0.5, 0.5) },
      zoom: { value: 1 }, pointer: { value: new THREE.Vector2() }, mixAmt: { value: 0 }, strength: { value: 0.03 },
    };
  }, [a.map, a.depth, b.map, b.depth]);

  useFrame(() => {
    const s = state.current;
    if (!s) return;
    const view = size.width / Math.max(1, size.height);
    const aspect = (t: THREE.Texture) => {
      const img = t.image as { width: number; height: number };
      return img.width / img.height;
    };
    const covers = [coverFor(aspect(a.map), view), coverFor(aspect(b.map), view)];
    // R3F copies the `uniforms` prop onto the material, so write to the material's own set.
    const u = mat.current?.uniforms as typeof uniforms | undefined;
    if (!u) return;
    u.coverA.value.set(...covers[0]);
    u.coverB.value.set(...covers[1]);
    u.centerA.value.set(...clampCenter(s.center[0], covers[0], s.zoom, s.margin));
    u.centerB.value.set(...clampCenter(s.center[1] ?? s.center[0], covers[1], s.zoom, s.margin));
    u.zoom.value = s.zoom;
    u.pointer.value.set(...s.pointer);
    u.mixAmt.value = s.mix;
    u.strength.value = s.strength;
    onFrame?.(covers);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} depthTest={false} depthWrite={false} />
    </mesh>
  );
}
