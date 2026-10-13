'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  Object3D,
  OctahedronGeometry,
  TorusGeometry,
  Vector2,
} from 'three';
import { useAnchors, type Anchor } from '@/lib/anchors';
import { runtime } from '@/lib/runtime';

const GOLD = '#d9b46a';
const CREAM = '#fbf3e6';

const gemGeometry = (() => {
  const pts = [new Vector2(0.001, -1.3), new Vector2(1, 0.12), new Vector2(0.8, 0.44), new Vector2(0.42, 0.56), new Vector2(0.001, 0.56)];
  const g = new LatheGeometry(pts, 10).toNonIndexed();
  g.computeVertexNormals();
  return g;
})();
const gemEdges = new EdgesGeometry(gemGeometry, 1);
const icoEdges = new EdgesGeometry(new IcosahedronGeometry(1, 1));
const ring = new TorusGeometry(1, 0.006, 6, 128);
const needle = new OctahedronGeometry(1, 0);

/** Brilliant-cut gem with a wireframe cage. */
function Gem() {
  return (
    <>
      <mesh geometry={gemGeometry} scale={0.55}>
        <meshPhysicalMaterial color={CREAM} metalness={0.15} roughness={0.08} clearcoat={1} iridescence={0.8} envMapIntensity={2.2} flatShading />
      </mesh>
      <lineSegments geometry={gemEdges} scale={0.56}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.9} />
      </lineSegments>
      <lineSegments geometry={icoEdges} scale={1.05}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.22} />
      </lineSegments>
    </>
  );
}

/** Nested gimbal rings — a horizon / orbit motif. */
function Orbit() {
  const rings = useRef<Group>(null);
  useFrame((s) => {
    const g = rings.current;
    if (!g) return;
    const t = s.clock.elapsedTime;
    g.children.forEach((c, i) => {
      c.rotation.x = t * (0.2 + i * 0.12) + i;
      c.rotation.y = t * (0.15 + i * 0.08);
    });
  });
  return (
    <>
      <group ref={rings}>
        {[1, 0.78, 0.56].map((r, i) => (
          <mesh key={i} geometry={ring} scale={r}>
            <meshStandardMaterial color={i === 1 ? CREAM : GOLD} metalness={1} roughness={0.25} envMapIntensity={2} />
          </mesh>
        ))}
      </group>
      <mesh scale={0.16}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color={GOLD} metalness={0.9} roughness={0.15} clearcoat={1} envMapIntensity={2.4} flatShading />
      </mesh>
    </>
  );
}

/** Compass: a ring with a faceted needle that swings toward the pointer — "a new direction". */
function Compass() {
  const n = useRef<Group>(null);
  useFrame((s, d) => {
    if (!n.current) return;
    const target = Math.atan2(runtime.pointer.x, runtime.pointer.y + 0.6) * 0.8 + Math.sin(s.clock.elapsedTime * 0.7) * 0.08;
    n.current.rotation.z += (-target - n.current.rotation.z) * (1 - Math.exp(-4 * Math.min(d, 0.05)));
  });
  return (
    <>
      <mesh geometry={ring}>
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} envMapIntensity={2} />
      </mesh>
      <mesh geometry={ring} scale={0.86}>
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.35} transparent opacity={0.5} />
      </mesh>
      <group ref={n}>
        <mesh geometry={needle} scale={[0.09, 0.72, 0.04]}>
          <meshPhysicalMaterial color={CREAM} metalness={0.6} roughness={0.12} clearcoat={1} envMapIntensity={2.4} flatShading />
        </mesh>
      </group>
    </>
  );
}

function AnchorObject({ anchor }: { anchor: Anchor }) {
  const group = useRef<Group>(null);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  const viewport = useThree((s) => s.viewport);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const r = anchor.el.getBoundingClientRect();
    const on = r.bottom > 0 && r.top < size.height && r.width > 0;
    g.visible = on;
    if (!on) return;
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0]);
    const k = vp.width / size.width;
    g.position.set((r.left + r.width / 2 - size.width / 2) * k, -(r.top + r.height / 2 - size.height / 2) * k, 0.5);
    // Size from the DOM box; spin is driven by scroll position + time; tilt follows the pointer.
    const travel = (r.top + r.height / 2) / size.height - 0.5;
    g.scale.setScalar(Math.min(r.width, r.height) * k * 0.45 * (1 - Math.abs(travel) * 0.25));
    const t = state.clock.elapsedTime;
    const dk = 1 - Math.exp(-3 * Math.min(delta, 0.05));
    g.rotation.y = t * 0.25 + travel * 2.4;
    g.rotation.x += (0.25 + travel * 0.6 - runtime.pointer.y * 0.25 - g.rotation.x) * dk;
    g.rotation.z += (-runtime.pointer.x * 0.15 - g.rotation.z) * dk;
  });

  return (
    <group ref={group} visible={false}>
      {anchor.kind === 'gem' && <Gem />}
      {anchor.kind === 'orbit' && <Orbit />}
      {anchor.kind === 'compass' && <Compass />}
    </group>
  );
}

export function AnchorObjects() {
  const anchors = useAnchors((s) => s.anchors);
  return (
    <>
      {Object.values(anchors).map((a) => (
        <AnchorObject key={a.id} anchor={a} />
      ))}
    </>
  );
}

/** Small faceted crystals drifting over the hero, parting around the pointer. */
const dummy = new Object3D();
export function HeroCrystals({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const viewport = useThree((s) => s.viewport);
  const data = useMemo(() => {
    let seed = 11;
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    return Array.from({ length: count }, () => ({
      x: r() * 2 - 1, y: r() * 2 - 1, z: 0.5 + r() * 3.5, s: 0.06 + r() * 0.14,
      sp: 0.3 + r() * 0.6, ph: r() * 6.28, rx: r() * 3, ry: r() * 3,
    }));
  }, [count]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const { active, progress } = runtime.hero;
    m.visible = active;
    if (!active) return;
    const t = state.clock.elapsedTime;
    const fade = 1 - Math.min(1, progress * 1.6);
    data.forEach((d, i) => {
      const depth = (10 - d.z) / 10;
      dummy.position.set(
        (d.x * viewport.width * 0.55 + runtime.pointer.x * d.z * 0.12) * depth,
        (d.y * viewport.height * 0.5 + Math.sin(t * d.sp + d.ph) * 0.15 + progress * viewport.height * 0.6 * d.sp + runtime.pointer.y * d.z * 0.08) * depth,
        d.z,
      );
      dummy.rotation.set(d.rx + t * d.sp * 0.5, d.ry + t * d.sp * 0.7, 0);
      dummy.scale.set(d.s * 0.45 * fade, d.s * fade, d.s * 0.45 * fade);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[needle, undefined, count]} frustumCulled={false}>
      <meshPhysicalMaterial color={CREAM} metalness={0.2} roughness={0.05} clearcoat={1} iridescence={1} iridescenceIOR={1.5} envMapIntensity={2.6} flatShading transparent opacity={0.85} />
    </instancedMesh>
  );
}
