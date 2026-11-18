"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { forceLayout } from "@/engines/graph";
import type { Entity, EntityCategory, Relationship } from "@/types";

const COLORS: Record<EntityCategory, string> = {
  person: "#00D5FF", organization: "#3478FF", location: "#8B78FF",
  project: "#FFB547", event: "#FF5B66", document: "#42DDA0",
};

interface Graph3DProps {
  entities: Entity[];
  relationships: Relationship[];
  selected: string[];
  pathNodes: string[];
  pathEdges: string[];
  onSelect: (id: string) => void;
  resetKey: number;
}

export default function Graph3D({
  entities, relationships, selected, pathNodes, pathEdges, onSelect, resetKey,
}: Graph3DProps) {
  const positions = useMemo(
    () => forceLayout(entities, relationships),
    [entities, relationships],
  );

  const { linePositions, lineColors } = useMemo(() => {
    const lp: number[] = [], lc: number[] = [];
    for (const rel of relationships) {
      const a = positions.get(rel.source), b = positions.get(rel.target);
      if (!a || !b) continue;
      lp.push(a.x, a.y, a.z, b.x, b.y, b.z);
      const hot = pathEdges.includes(rel.id);
      const c = new THREE.Color(hot ? "#FFB547" : "#1C2B3A");
      lc.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    return {
      linePositions: new Float32Array(lp),
      lineColors: new Float32Array(lc),
    };
  }, [relationships, positions, pathEdges]);

  return (
    <Canvas key={resetKey} camera={{ position: [0, 2, 26], fov: 52 }}
      dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
      <color attach="background" args={["#05070B"]} />
      <fog attach="fog" args={["#05070B", 25, 55]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[8, 10, 12]} color="#00D5FF" intensity={80} distance={60} />
      <pointLight position={[-10, -8, 6]} color="#3478FF" intensity={60} distance={60} />

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.9} />
      </lineSegments>

      {entities.map((e) => {
        const p = positions.get(e.id);
        if (!p) return null;
        const isSelected = selected.includes(e.id);
        const onPath = pathNodes.includes(e.id);
        const color = new THREE.Color(isSelected || onPath ? "#FFB547" : COLORS[e.category]);
        return (
          <group key={e.id} position={[p.x, p.y, p.z]}>
            <mesh
              onClick={(ev) => { ev.stopPropagation(); onSelect(e.id); }}
              onPointerOver={(ev) => { ev.stopPropagation(); document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { document.body.style.cursor = "auto"; }}
            >
              <sphereGeometry args={[isSelected ? 0.75 : 0.5, 20, 20]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.2 : 0.45} />
            </mesh>
            {(isSelected || onPath) && (
              <mesh>
                <sphereGeometry args={[1.05, 16, 16]} />
                <meshBasicMaterial color="#FFB547" wireframe transparent opacity={0.5} />
              </mesh>
            )}
          </group>
        );
      })}
      <OrbitControls enableDamping makeDefault minDistance={8} maxDistance={60} />
    </Canvas>
  );
}
