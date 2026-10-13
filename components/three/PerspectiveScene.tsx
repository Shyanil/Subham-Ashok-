'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  Object3D,
  OctahedronGeometry,
  Points,
  ShaderMaterial,
} from 'three';
import { dustFragment, dustVertex } from '@/shaders/dust';
import { runtime } from '@/lib/runtime';

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Deterministic PRNG so shards land in the same place on every visit. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const dummy = new Object3D();

function Shards({ count, transmission }: { count: number; transmission: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const viewport = useThree((s) => s.viewport);

  const geometry = useMemo(() => {
    const g = new OctahedronGeometry(1, 0);
    g.scale(0.38, 1, 0.38);
    return g;
  }, []);

  const shards = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: count }, (_, i) => ({
      x: (r() * 2 - 1) * 0.62,
      y: (i / count) * 2 - 1 + (r() - 0.5) * 0.25,
      z: -4.5 + r() * 8,
      rx: r() * Math.PI,
      ry: r() * Math.PI,
      rz: r() * Math.PI,
      s: 0.18 + r() * 0.42,
      speed: 0.4 + r() * 0.8,
      phase: r() * Math.PI * 2,
      drift: 0.6 + r() * 1.6,
    }));
  }, [count]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const { progress } = runtime.perspective;
    const appear = smoothstep(0.18, 0.36, progress) * (1 - smoothstep(0.86, 1, progress));
    const w = viewport.width;
    const h = viewport.height;
    shards.forEach((d, i) => {
      const depthScale = (10 - d.z) / 10;
      dummy.position.set(
        d.x * w * depthScale,
        (d.y * h * 0.75 + (progress - 0.5) * h * d.drift) * depthScale + Math.sin(t * d.speed + d.phase) * 0.12,
        d.z,
      );
      dummy.rotation.set(d.rx + t * 0.12 * d.speed + progress * 2.4, d.ry + t * 0.18 * d.speed + progress * 3.2, d.rz);
      dummy.scale.setScalar(d.s * (0.2 + 0.8 * appear));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}>
      {transmission ? (
        <meshPhysicalMaterial
          color="#fbf3e6"
          transmission={1}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          iridescence={0.6}
          iridescenceIOR={1.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          attenuationColor="#d9b46a"
          attenuationDistance={4}
          envMapIntensity={2.2}
          specularIntensity={1}
        />
      ) : (
        <meshPhysicalMaterial
          color="#f0dcc0"
          metalness={0.25}
          roughness={0.12}
          clearcoat={1}
          transparent
          opacity={0.6}
          envMapIntensity={1.8}
        />
      )}
    </instancedMesh>
  );
}

type SceneState = { progress: number; active: boolean };

/** Glowing gold dust (Points). `fade` shapes opacity over the scene's progress. */
export function Dust({
  count,
  source = runtime.perspective,
  fade = (p) => smoothstep(0.18, 0.36, p) * (1 - smoothstep(0.88, 1, p)),
  opacity = 0.85,
  size = 22,
}: {
  count: number;
  source?: SceneState;
  fade?: (p: number) => number;
  opacity?: number;
  size?: number;
}) {
  const points = useRef<Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const r = rng(42);
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() * 2 - 1) * 9;
      pos[i * 3 + 1] = (r() * 2 - 1) * 6;
      pos[i * 3 + 2] = -5 + r() * 9;
      scale[i] = 0.35 + r() * 1.3;
      phase[i] = r();
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aScale', new BufferAttribute(scale, 1));
    g.setAttribute('aPhase', new BufferAttribute(phase, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSize: { value: size },
          uPixelRatio: { value: Math.min(dpr, 2) },
          uColor: { value: new Color(1.7, 1.32, 0.86) },
          uOpacity: { value: 0 },
        },
      }),
    [dpr, size],
  );

  useFrame((state) => {
    const { progress, active } = source;
    if (points.current) points.current.visible = active;
    if (!active) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProgress.value = progress;
    material.uniforms.uOpacity.value = opacity * fade(progress);
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

/** Floating crystal shards + gold dust for the "A new perspective" chapter. */
export function PerspectiveScene({ simplified }: { simplified: boolean }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const { active } = runtime.perspective;
    g.visible = active;
    if (!active) return;
    const k = 1 - Math.exp(-3 * Math.min(delta, 0.05));
    g.rotation.y += (runtime.pointer.x * 0.12 - g.rotation.y) * k;
    g.rotation.x += (-runtime.pointer.y * 0.08 - g.rotation.x) * k;
  });

  return (
    <>
      {/* Local light-former environment — no HDR download needed. */}
      <Environment resolution={simplified ? 32 : 128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#fbf3e6" position={[0, 4, -6]} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#d9b46a" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={2.5} color="#ffe2b5" position={[5, 2, 3]} scale={3} />
        <Lightformer form="rect" intensity={1.2} color="#ad6b46" position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
      </Environment>
      <group ref={group} visible={false}>
        <Shards count={simplified ? 8 : 16} transmission={!simplified} />
        <Dust count={simplified ? 180 : 500} />
      </group>
    </>
  );
}
