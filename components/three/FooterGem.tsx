'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { AdditiveBlending, Group, LatheGeometry, ShaderMaterial, Vector2 } from 'three';
import { runtime } from '@/lib/runtime';

const haloVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const haloFragment = /* glsl */ `
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
void main() {
  float d = distance(vUv, vec2(0.5));
  float core = smoothstep(0.5, 0.0, d);
  float ring = smoothstep(0.012, 0.0, abs(d - 0.34 - 0.01 * sin(uTime))) * 0.22;
  vec3 col = vec3(1.25, 0.95, 0.6) * (pow(core, 3.0) * 0.9 + ring);
  gl_FragColor = vec4(col, (pow(core, 3.0) + ring) * uOpacity);
}
`;

/**
 * Faceted brilliant-cut crystal echoing the logo, floating behind the closing headline.
 * Mounted only while the footer is on screen: MeshTransmissionMaterial renders an
 * extra scene pass every frame, which we don't want to pay for elsewhere.
 */
export function FooterGem({ simplified }: { simplified: boolean }) {
  const [mounted, setMounted] = useState(false);
  const last = useRef(false);
  useFrame(() => {
    if (runtime.footer.active !== last.current) {
      last.current = runtime.footer.active;
      setMounted(last.current);
    }
  });
  return mounted ? <Gem simplified={simplified} /> : null;
}

function Gem({ simplified }: { simplified: boolean }) {
  const group = useRef<Group>(null);
  const gem = useRef<Group>(null);
  const viewport = useThree((s) => s.viewport);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const geometry = useMemo(() => {
    const pts = [
      new Vector2(0.001, -1.3),
      new Vector2(1.0, 0.12),
      new Vector2(0.8, 0.44),
      new Vector2(0.42, 0.56),
      new Vector2(0.001, 0.56),
    ];
    const g = new LatheGeometry(pts, 12).toNonIndexed();
    g.computeVertexNormals();
    return g;
  }, []);

  const halo = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 } },
      }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    const m = gem.current;
    if (!g || !m) return;
    const { active, progress, el } = runtime.footer;
    const r = el?.getBoundingClientRect();
    const on = active && !!r && r.width > 0 && r.bottom > 0 && r.top < size.height;
    g.visible = on;
    if (!on || !r) return;
    const t = state.clock.elapsedTime;
    const ease = 1 - Math.pow(1 - Math.min(1, progress * 1.4), 3);
    // Map the anchor box (CSS px) onto the z = -1 plane the gem lives on.
    const vp = viewport.getCurrentViewport(camera, [0, 0, -1]);
    const px = vp.width / size.width;
    g.position.set((r.left + r.width / 2 - size.width / 2) * px, -(r.top + r.height / 2 - size.height / 2) * px - (1 - ease) * r.height * px * 0.4, -1);
    g.scale.setScalar(Math.min(r.width, r.height) * px * 0.36 * (0.75 + 0.25 * ease));
    const k = 1 - Math.exp(-3 * Math.min(delta, 0.05));
    m.rotation.y = t * 0.3 + progress * Math.PI;
    m.rotation.x += (0.35 - runtime.pointer.y * 0.25 - m.rotation.x) * k;
    m.rotation.z += (-runtime.pointer.x * 0.2 - m.rotation.z) * k;
    m.position.y = Math.sin(t * 0.8) * 0.06;
    halo.uniforms.uOpacity.value = 0.55 * ease;
    halo.uniforms.uTime.value = t;
  });

  return (
    <group ref={group} visible={false}>
      <mesh position={[0, 0, -1.2]} scale={5.5} material={halo} renderOrder={-1}>
        <planeGeometry />
      </mesh>
      <group ref={gem}>
        <mesh geometry={geometry}>
          {simplified ? (
            <meshPhysicalMaterial color="#fbf3e6" metalness={0.1} roughness={0.05} clearcoat={1} iridescence={0.7} envMapIntensity={2} flatShading />
          ) : (
            <MeshTransmissionMaterial
              samples={4}
              resolution={256}
              transmission={1}
              thickness={1.2}
              roughness={0.02}
              ior={1.6}
              chromaticAberration={0.08}
              anisotropicBlur={0.15}
              distortion={0.25}
              distortionScale={0.4}
              temporalDistortion={0.08}
              iridescence={0.8}
              iridescenceIOR={1.4}
              clearcoat={1}
              color="#ffffff"
              attenuationColor="#fbf3e6"
              attenuationDistance={6}
              envMapIntensity={1.6}
              flatShading
            />
          )}
        </mesh>
      </group>
    </group>
  );
}
