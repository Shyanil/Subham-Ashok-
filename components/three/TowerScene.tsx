'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef, type ComponentRef } from 'react';
import * as THREE from 'three';
import { HOTSPOTS, VIEWS, type Vec3, type ViewId } from './towerData';

type Props = {
  night: boolean;
  view: ViewId;
  spot: string | null;
  onSpot: (id: string | null) => void;
  /** "hero": transparent background, plinth, slow auto-rotate, labels instead of markers. */
  variant?: 'hero' | 'tour';
  showLabels?: boolean;
  /** Pause rendering (e.g. when scrolled off screen). */
  paused?: boolean;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ── Procedural façade ─────────────────────────────────────────────────────
   One 256² tile = 4 bays × 4 storeys (1 world unit each). `map` draws the day
   façade; `emissiveMap` holds randomly lit windows for the night view. */
function facadeTextures() {
  const make = () => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    return [c, c.getContext('2d')!] as const;
  };
  const [day, d] = make();
  const [glow, g] = make();
  d.fillStyle = '#efe5d6';
  d.fillRect(0, 0, 256, 256);
  g.fillStyle = '#000';
  g.fillRect(0, 0, 256, 256);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let floor = 0; floor < 4; floor++) {
    const y = floor * 64;
    d.fillStyle = '#c7b39a'; // slab band
    d.fillRect(0, y + 56, 256, 8);
    for (let bay = 0; bay < 4; bay++) {
      const x = bay * 64;
      d.fillStyle = '#5b6b75';
      d.fillRect(x + 10, y + 14, 44, 36);
      d.fillStyle = '#8fa3ad';
      d.fillRect(x + 12, y + 16, 19, 32);
      d.fillStyle = '#6d3524'; // balcony rail
      d.fillRect(x + 6, y + 44, 52, 3);
      if (rand() > 0.32) {
        g.fillStyle = `rgba(255,255,255,${0.65 + rand() * 0.35})`;
        g.fillRect(x + 10, y + 14, 44, 36);
      }
    }
  }
  const tex = (c: HTMLCanvasElement, srgb: boolean) => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  return { map: tex(day, true), emissiveMap: tex(glow, false) };
}

/** BoxGeometry whose side-face UVs are scaled to world size, so the tile repeats at a constant scale. */
function towerGeometry(w: number, h: number, d: number) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  // Face order: +x, −x, +y, −y, +z, −z (4 vertices each).
  const size: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) {
    const [fw, fh] = size[f];
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * fw) / 4, (uv.getY(i) * fh) / 4);
    }
  }
  return geo;
}

function Tower({ size, position, facade, night, delay = 0 }: { size: Vec3; position: Vec3; facade: ReturnType<typeof facadeTextures>; night: boolean; delay?: number }) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);
  // Rises floor-by-floor on mount: scale.y 0 → 1 from the base, staggered per tower.
  useFrame((state, dt) => {
    const g = group.current;
    if (!g || g.scale.y >= 1) return;
    t.current += Math.min(dt, 0.05);
    const p = Math.min(1, Math.max(0, (t.current - delay) / 1.6));
    g.scale.y = Math.max(0.0001, easeOut(p));
    state.invalidate();
  });
  const [w, h, d] = size;
  const geo = useMemo(() => towerGeometry(w, h, d), [w, h, d]);
  const side = useMemo(
    () => new THREE.MeshStandardMaterial({ map: facade.map, emissiveMap: facade.emissiveMap, emissive: new THREE.Color('#ffc979'), roughness: 0.85 }),
    [facade],
  );
  const roof = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d9ccb8', roughness: 1 }), []);
  useEffect(() => {
    side.emissiveIntensity = night ? 1.25 : 0;
  }, [night, side]);
  useEffect(() => () => (geo.dispose(), side.dispose(), roof.dispose()), [geo, side, roof]);
  return (
    <group ref={group} position={position} scale={[1, 0.0001, 1]}>
      <mesh geometry={geo} material={[side, side, roof, roof, side, side]} position={[0, h / 2, 0]} />
      {/* parapet crown in brand brown */}
      <mesh position={[0, h + 0.12, 0]}>
        <boxGeometry args={[w + 0.2, 0.24, d + 0.2]} />
        <meshStandardMaterial color="#5a2419" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Box({ args, position, color, emissive, night = false, glow = 0 }: { args: Vec3; position: Vec3; color: string; emissive?: string; night?: boolean; glow?: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} emissive={emissive ?? '#000'} emissiveIntensity={night ? glow : 0} roughness={0.9} />
    </mesh>
  );
}

function Trees() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => {
    const p: Vec3[] = [];
    for (let x = -13; x <= 13; x += 2.2) p.push([x, 0, -14.6]);
    for (let z = -3; z <= 13; z += 2) p.push([-5.4, 0, z], [5.4, 0, z]);
    for (let x = -13; x <= -6; x += 2.3) p.push([x, 0, -3.4]);
    for (let x = 6; x <= 13; x += 2.3) p.push([x, 0, -3.4]);
    return p;
  }, []);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    positions.forEach(([x, , z], i) => {
      const s = 0.75 + ((i * 37) % 10) / 22;
      m.compose(new THREE.Vector3(x, 1.1 * s, z), new THREE.Quaternion(), new THREE.Vector3(s, s, s));
      ref.current!.setMatrixAt(i, m);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [positions]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, positions.length]}>
      <icosahedronGeometry args={[0.85, 0]} />
      <meshStandardMaterial color="#4f7d45" roughness={1} flatShading />
    </instancedMesh>
  );
}

function Site({ night, hero = false }: { night: boolean; hero?: boolean }) {
  const facade = useMemo(facadeTextures, []);
  useEffect(() => () => (facade.map.dispose(), facade.emissiveMap.dispose()), [facade]);
  const lawn = night ? '#2f4a2b' : '#7fae5f';
  const cars = useMemo(() => {
    const colors = ['#9c2f22', '#e8e4dc', '#30343a', '#5a6f86', '#c9a24a'];
    const list: { p: Vec3; c: string }[] = [];
    for (let z = -13; z <= -5.5; z += 1.5) {
      list.push({ p: [-12.8, 0.3, z], c: colors[(Math.abs(z) * 3) % 5 | 0] }, { p: [12.8, 0.3, z], c: colors[(Math.abs(z) * 7) % 5 | 0] });
    }
    return list;
  }, []);

  return (
    <group>
      {/* ground, plot, road */}
      {hero ? (
        <mesh position={[0, -0.36, 1]}>
          <cylinderGeometry args={[24, 24.6, 0.7, 72]} />
          <meshStandardMaterial color="#e6d6c4" roughness={1} />
        </mesh>
      ) : (
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color={night ? '#1d1a12' : '#b9c79a'} roughness={1} />
        </mesh>
      )}
      <Box args={[28, 0.06, 10]} position={[0, 0.03, -9]} color="#ddd3c3" />
      <Box args={[9, 0.06, 18]} position={[0, 0.03, 5]} color="#ddd3c3" />
      <Box args={[34, 0.04, 3.2]} position={[0, 0.02, 16]} color={night ? '#2b2b2e' : '#6f6f72'} />
      <Box args={[34, 0.05, 0.12]} position={[0, 0.04, 16]} color="#efe9df" />

      {/* Block B: podium (parking + 1st floor clubhouse / pool / gym) with two towers */}
      <Box args={[22, 2, 6]} position={[0, 1, -9]} color="#d8c7ae" emissive="#ffcc85" night={night} glow={0.25} />
      <Box args={[22.2, 0.15, 6.2]} position={[0, 2.05, -9]} color="#5a2419" />
      <Tower size={[7.6, 10, 5]} position={[-6.2, 2.1, -9.4]} facade={facade} night={night} delay={0.35} />
      <Tower size={[7.6, 10, 5]} position={[6.2, 2.1, -9.4]} facade={facade} night={night} delay={0.6} />
      {/* pool + clubhouse pavilion in the gap */}
      <mesh position={[0, 2.16, -9.8]}>
        <boxGeometry args={[3.4, 0.06, 3]} />
        <meshStandardMaterial color="#4fb4cf" emissive="#3ad0ff" emissiveIntensity={night ? 0.8 : 0.05} roughness={0.15} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.7, -7.1]}>
        <boxGeometry args={[3.6, 1.2, 1.4]} />
        <meshStandardMaterial color="#cfe0e6" transparent opacity={0.75} emissive="#ffd59a" emissiveIntensity={night ? 0.9 : 0} roughness={0.2} />
      </mesh>

      {/* Block A: stilt + 6 floors */}
      <Box args={[6.6, 1, 6.6]} position={[0, 0.5, 8.5]} color="#8c7a66" emissive="#ffcc85" night={night} glow={0.4} />
      <Tower size={[7, 6, 7]} position={[0, 1, 8.5]} facade={facade} night={night} delay={0.1} />

      {/* lawn, play area, amphitheatre, open gym */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.07, -0.1]}>
        <planeGeometry args={[7.6, 7.8]} />
        <meshStandardMaterial color={lawn} roughness={1} />
      </mesh>
      {[1.4, 2, 2.6].map((r) => (
        <mesh key={r} rotation-x={-Math.PI / 2} position={[2, 0.1 + (2.6 - r) * 0.12, 1.6]}>
          <ringGeometry args={[r - 0.22, r, 24, 1, Math.PI * 0.5, Math.PI]} />
          <meshStandardMaterial color="#d9cbb3" side={THREE.DoubleSide} />
        </mesh>
      ))}
      <Box args={[0.8, 0.8, 0.8]} position={[-2.8, 0.45, -2.6]} color="#e6743a" />
      <Box args={[0.3, 1.2, 0.3]} position={[-2, 0.65, -2.2]} color="#3d7bc4" />
      <Box args={[1.2, 0.12, 0.4]} position={[-2.4, 0.9, -3.1]} color="#f2c230" />
      {[-0.6, 0, 0.6].map((dx) => (
        <Box key={dx} args={[0.12, 0.9, 0.12]} position={[2.6 + dx, 0.5, -2.6]} color="#3a3a3a" />
      ))}

      {/* gate */}
      <Box args={[0.6, 1.8, 0.6]} position={[-2.6, 0.9, 14.2]} color="#9a7b5b" />
      <Box args={[0.6, 1.8, 0.6]} position={[2.6, 0.9, 14.2]} color="#9a7b5b" />
      <Box args={[6.4, 0.25, 1.4]} position={[0, 1.95, 14.2]} color="#5a2419" emissive="#ffcc85" night={night} glow={0.6} />

      {cars.map((c, i) => (
        <Box key={i} args={[0.9, 0.5, 0.5]} position={c.p} color={c.c} />
      ))}
      <Trees />

      {/* street lamps glow at night */}
      {night &&
        [-10, -5, 5, 10].map((x) => (
          <mesh key={x} position={[x, 1.2, 14.6]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshBasicMaterial color="#ffd89a" />
          </mesh>
        ))}
    </group>
  );
}

function Rig({ view, spot, controls }: { view: ViewId; spot: string | null; controls: React.RefObject<ComponentRef<typeof OrbitControls> | null> }) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const goal = useRef<{ pos: THREE.Vector3; tgt: THREE.Vector3 } | null>(null);

  useEffect(() => {
    const h = HOTSPOTS.find((x) => x.id === spot);
    const v = VIEWS.find((x) => x.id === view)!;
    goal.current = h
      ? { pos: new THREE.Vector3(...h.camera), tgt: new THREE.Vector3(...h.at) }
      : { pos: new THREE.Vector3(...v.camera), tgt: new THREE.Vector3(...v.target) };
    invalidate();
  }, [view, spot, invalidate]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stop = () => (goal.current = null);
    c.addEventListener('start', stop);
    return () => c.removeEventListener('start', stop);
  }, [controls]);

  useFrame((_, dt) => {
    const g = goal.current;
    const c = controls.current;
    if (!g || !c) return;
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 3.2);
    camera.position.lerp(g.pos, k);
    c.target.lerp(g.tgt, k);
    c.update();
    if (camera.position.distanceTo(g.pos) < 0.05 && c.target.distanceTo(g.tgt) < 0.05) goal.current = null;
    else invalidate();
  });
  return null;
}

const LABELS: { at: Vec3; title: string; note: string }[] = [
  { at: [-6.2, 13.4, -9.4], title: 'Block B', note: '11 floors · 2 towers' },
  { at: [0, 8.4, 8.5], title: 'Block A', note: '6 floors · penthouses' },
  { at: [0, 3.4, -8.6], title: 'Clubhouse and pool', note: 'On the podium' },
];

function Labels() {
  return LABELS.map((l) => (
    <Html key={l.title} position={l.at} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <div className="whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-center shadow-lg ring-1 ring-black/5">
        <p className="font-serif text-[16px] leading-none text-ink">{l.title}</p>
        <p className="mt-0.5 text-[11px] font-semibold text-muted">{l.note}</p>
      </div>
    </Html>
  ));
}

function Markers({ spot, onSpot }: { spot: string | null; onSpot: (id: string | null) => void }) {
  return HOTSPOTS.map((h, i) => (
    <Html key={h.id} position={h.at} center zIndexRange={[20, 0]}>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => onSpot(spot === h.id ? null : h.id)}
        title={h.name}
        className={`grid size-9 place-items-center rounded-full border-2 border-brand text-[12px] font-bold shadow-md transition-transform hover:scale-110 ${
          spot === h.id ? 'scale-110 bg-brand text-white' : 'bg-white text-brand'
        }`}
      >
        {i + 1}
      </button>
    </Html>
  ));
}

export default function TowerScene({ night, view, spot, onSpot, variant = 'tour', paused = false, showLabels = true }: Props) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const hero = variant === 'hero';
  const bg = night ? '#150806' : '#efe6da';
  const start = hero ? { camera: [50, 34, 50] as Vec3, target: [0, 3.5, 0] as Vec3 } : VIEWS[0];
  return (
    <Canvas
      frameloop={paused ? 'never' : hero ? 'always' : 'demand'}
      dpr={[1, 1.75]}
      camera={{ position: start.camera, fov: hero ? 32 : 38, near: 0.5, far: 300 }}
      gl={{ antialias: true, powerPreference: 'default', alpha: hero }}
      aria-label="Interactive 3D model of Subham Ashok Heights"
      role="img"
    >
      {!hero && <color attach="background" args={[bg]} />}
      {!hero && <fog attach="fog" args={[bg, 70, 150]} />}
      <hemisphereLight args={[night ? '#8a6a8f' : '#ffffff', night ? '#1a0e0a' : '#c9b49d', night ? 0.4 : 1.7]} />
      <directionalLight position={[22, 34, 14]} intensity={night ? 0.25 : 2.3} color={night ? '#c9a6ff' : '#fff4e6'} />
      <directionalLight position={[-20, 14, -18]} intensity={night ? 0 : 0.6} color="#f3e2cf" />
      <ambientLight intensity={night ? 0.15 : 0.35} />
      <Site night={night} hero={hero} />
      {hero ? (showLabels ? <Labels /> : null) : <Markers spot={spot} onSpot={onSpot} />}
      <OrbitControls
        ref={controls}
        makeDefault
        target={start.target}
        enableDamping
        enablePan={false}
        enableZoom={!hero}
        autoRotate={hero}
        autoRotateSpeed={0.55}
        minDistance={10}
        maxDistance={70}
        minPolarAngle={hero ? Math.PI * 0.22 : 0}
        maxPolarAngle={Math.PI * (hero ? 0.4 : 0.46)}
      />
      {!hero && <Rig view={view} spot={spot} controls={controls} />}
    </Canvas>
  );
}
