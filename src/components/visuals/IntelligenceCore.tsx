"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group, Points } from "three";
import * as THREE from "three";

/** Deterministic PRNG so the sample visualization renders identically every time. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CYAN = new THREE.Color("#00D5FF");
const BLUE = new THREE.Color("#3478FF");
const AMBER = new THREE.Color("#FFB547");

/** Distributed particle field around the core. */
function ParticleField({ count = 900, reducedMotion }: { count?: number; reducedMotion: boolean }) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(1337);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // shell distribution between r=6.5 and r=11
      const r = 6.5 + rand() * 4.5;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={CYAN}
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Evidence-node network: fixed nodes on a sphere with proximity edges. */
function NetworkShell({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Group>(null);

  const { nodes, edges } = useMemo(() => {
    const rand = mulberry32(42);
    const n = 52;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      const theta = i * Math.PI * (3 - Math.sqrt(5)); // golden-angle spread
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      pts.push(new THREE.Vector3(Math.cos(theta) * r * 6, y * 4.2, Math.sin(theta) * r * 6));
    }
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (pts[i].distanceTo(pts[j]) < 3.4 && rand() > 0.25) {
          lines.push([pts[i], pts[j]]);
        }
      }
    }
    return { nodes: pts, edges: lines };
  }, []);

  const edgeGeometry = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      arr.set([a.x, a.y, a.z], i * 6);
      arr.set([b.x, b.y, b.z], i * 6 + 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [edges]);

  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={ref}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color={BLUE} transparent opacity={0.28} depthWrite={false} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color={i % 11 === 0 ? AMBER : CYAN} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** Central intelligence core: glowing nucleus + rotating wireframe shells. */
function IntelligenceNucleus({ reducedMotion }: { reducedMotion: boolean }) {
  const inner = useRef<Group>(null);
  const outer = useRef<Group>(null);

  useFrame((state, delta) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    if (inner.current) {
      inner.current.rotation.y += delta * 0.18;
      const s = 1 + Math.sin(t * 1.4) * 0.04;
      inner.current.scale.setScalar(s);
    }
    if (outer.current) outer.current.rotation.y -= delta * 0.07;
  });

  return (
    <group>
      {/* glowing nucleus */}
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshStandardMaterial
          color={BLUE}
          emissive={CYAN}
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
      {/* inner rotating wireframe */}
      <group ref={inner}>
        <mesh>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.5} />
        </mesh>
      </group>
      {/* outer abstract shell */}
      <group ref={outer}>
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 5]}>
          <octahedronGeometry args={[2.6, 0]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.16} />
        </mesh>
        <mesh rotation={[Math.PI / 5, Math.PI / 4, 0]}>
          <torusGeometry args={[2.9, 0.012, 8, 96]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/** Sparse amber investigation markers on an outer ring. */
function AmberMarkers({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y += delta * 0.03;
  });
  const positions = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: 6 }, () => {
      const a = rand() * Math.PI * 2;
      return [Math.cos(a) * 7.4, (rand() - 0.5) * 5, Math.sin(a) * 7.4] as const;
    });
  }, []);
  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshBasicMaterial color={AMBER} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function IntelligenceCore() {
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <Canvas
      camera={{ position: [0, 1.5, 13], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#05070B", 12, 26]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} color={CYAN} intensity={60} distance={30} />
      <pointLight position={[-8, -4, 4]} color={BLUE} intensity={50} distance={30} />

      <IntelligenceNucleus reducedMotion={reducedMotion} />
      <NetworkShell reducedMotion={reducedMotion} />
      <ParticleField reducedMotion={reducedMotion} />
      <AmberMarkers reducedMotion={reducedMotion} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.35}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
