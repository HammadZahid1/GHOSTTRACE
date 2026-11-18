import { describe, expect, it } from "vitest";
import { forceLayout, shortestPath, traverse, degreeCentrality } from "@/engines/graph";
import { SCENARIOS, validateScenario } from "@/data/scenarios";
import type { Entity, Relationship } from "@/types";

const entities: Entity[] = ["a", "b", "c", "d"].map((id) => ({
  id, investigationId: "x", name: id, category: "person", description: "",
  evidenceRefs: [], extractionMethod: "test", confidence: 1, notes: "",
}));
const rels: Relationship[] = [
  { id: "r1", investigationId: "x", source: "a", target: "b", type: "associated_with", label: "", evidenceRefs: [] },
  { id: "r2", investigationId: "x", source: "b", target: "c", type: "associated_with", label: "", evidenceRefs: [] },
  { id: "r3", investigationId: "x", source: "c", target: "d", type: "associated_with", label: "", evidenceRefs: [] },
];

describe("graph engines", () => {
  it("finds the shortest path with BFS", () => {
    const path = shortestPath(rels, "a", "d");
    expect(path?.nodes).toEqual(["a", "b", "c", "d"]);
    expect(path?.edges).toHaveLength(3);
    expect(shortestPath(rels, "a", "a")?.nodes).toEqual(["a"]);
    expect(shortestPath([], "a", "d")).toBeNull();
  });

  it("traverses bounded neighborhoods", () => {
    expect(traverse(rels, "b", 1).size).toBe(3);
    expect(traverse(rels, "b", 0).size).toBe(1);
  });

  it("calculates degree centrality", () => {
    expect(degreeCentrality(rels).get("b")).toBe(2);
  });

  it("produces a deterministic finite layout", () => {
    const a = forceLayout(entities, rels, 20);
    const b = forceLayout(entities, rels, 20);
    expect([...a.keys()]).toEqual([...b.keys()]);
    expect(a.get("a")).toEqual(b.get("a"));
    expect(Number.isFinite(a.get("a")!.x)).toBe(true);
  });
});

describe("scenario datasets", () => {
  it("contains complete fictional scenarios with valid references", () => {
    expect(SCENARIOS).toHaveLength(4);
    for (const s of SCENARIOS) {
      expect(s.entities.length).toBeGreaterThanOrEqual(10);
      expect(s.relationships.length).toBeGreaterThanOrEqual(15);
      expect(s.events.length).toBeGreaterThanOrEqual(15);
      expect(s.evidence.length).toBeGreaterThanOrEqual(8);
      expect(validateScenario(s)).toEqual([]);
    }
  });
});
