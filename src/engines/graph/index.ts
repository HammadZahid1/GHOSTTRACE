import type { Entity, Relationship } from "@/types";

export interface Point3 { x: number; y: number; z: number }

/**
 * Deterministic force-directed layout.
 * Seeded initial positions, repulsion + spring relaxation, fixed iteration count.
 */
export function forceLayout(
  entities: Entity[],
  relationships: Relationship[],
  iterations = 180,
): Map<string, Point3> {
  const rand = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };
  const r = rand(97);
  const pos = new Map<string, Point3>();
  entities.forEach((e, i) => {
    const a = (i / Math.max(entities.length, 1)) * Math.PI * 2;
    pos.set(e.id, {
      x: Math.cos(a) * 6 + (r() - 0.5),
      y: Math.sin(a) * 6 + (r() - 0.5),
      z: (r() - 0.5) * 4,
    });
  });

  const edges = relationships
    .filter((rel) => pos.has(rel.source) && pos.has(rel.target))
    .map((rel) => [rel.source, rel.target] as const);

  for (let step = 0; step < iterations; step++) {
    const force = new Map<string, Point3>();
    entities.forEach((e) => force.set(e.id, { x: 0, y: 0, z: 0 }));
    // repulsion
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = pos.get(entities[i].id)!, b = pos.get(entities[j].id)!;
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        const d2 = Math.max(dx * dx + dy * dy + dz * dz, 0.5);
        const f = 9 / d2;
        const fa = force.get(entities[i].id)!, fb = force.get(entities[j].id)!;
        fa.x += dx * f; fa.y += dy * f; fa.z += dz * f;
        fb.x -= dx * f; fb.y -= dy * f; fb.z -= dz * f;
      }
    }
    // springs
    for (const [a, b] of edges) {
      const pa = pos.get(a)!, pb = pos.get(b)!;
      const dx = pb.x - pa.x, dy = pb.y - pa.y, dz = pb.z - pa.z;
      const d = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), 0.01);
      const f = (d - 4) * 0.06;
      const fa = force.get(a)!, fb = force.get(b)!;
      fa.x += dx * f; fa.y += dy * f; fa.z += dz * f;
      fb.x -= dx * f; fb.y -= dy * f; fb.z -= dz * f;
    }
    // gravity + integrate
    const damping = 0.82;
    for (const e of entities) {
      const p = pos.get(e.id)!, f = force.get(e.id)!;
      p.x = Math.max(-12, Math.min(12, (p.x + (f.x - p.x * 0.008) * damping * 0.2)));
      p.y = Math.max(-12, Math.min(12, (p.y + (f.y - p.y * 0.008) * damping * 0.2)));
      p.z = Math.max(-6, Math.min(6, (p.z + (f.z - p.z * 0.01) * damping * 0.2)));
    }
  }
  return pos;
}

export interface GraphPath {
  nodes: string[];
  edges: Relationship[];
}

/** Breadth-first search for the shortest relationship path. */
export function shortestPath(
  relationships: Relationship[],
  start: string,
  end: string,
): GraphPath | null {
  if (start === end) return { nodes: [start], edges: [] };
  const adjacency = new Map<string, Array<{ to: string; rel: Relationship }>>();
  for (const rel of relationships) {
    for (const [a, b] of [[rel.source, rel.target], [rel.target, rel.source]] as const) {
      if (!adjacency.has(a)) adjacency.set(a, []);
      adjacency.get(a)!.push({ to: b, rel });
    }
  }
  const queue = [start];
  const visited = new Set([start]);
  const parent = new Map<string, { from: string; rel: Relationship }>();
  while (queue.length) {
    const current = queue.shift()!;
    for (const { to, rel } of adjacency.get(current) ?? []) {
      if (visited.has(to)) continue;
      visited.add(to);
      parent.set(to, { from: current, rel });
      if (to === end) {
        const nodes = [end];
        const edges: Relationship[] = [];
        let cursor = end;
        while (cursor !== start) {
          const p = parent.get(cursor)!;
          edges.unshift(p.rel);
          nodes.unshift(p.from);
          cursor = p.from;
        }
        return { nodes, edges };
      }
      queue.push(to);
    }
  }
  return null;
}
