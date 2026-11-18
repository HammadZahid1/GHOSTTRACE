"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { Badge, Button, EmptyState, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { forceLayout, shortestPath } from "@/engines/graph";
import { allEntities, useEntityStore } from "@/stores/entity-store";
import { allRelationships, useRelationshipStore } from "@/stores/relationship-store";
import { useInvestigationStore } from "@/stores/investigation-store";
import type { EntityCategory, RelationshipType } from "@/types";

const Graph3D = dynamic(() => import("@/components/graph/Graph3D"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center gt-label">initializing graph renderer…</div>,
});

const CATEGORIES: EntityCategory[] = ["person", "organization", "location", "project", "event", "document"];
const REL_TYPES: RelationshipType[] = [
  "associated_with", "member_of", "located_at", "authored", "referenced", "funded", "communicated_with", "participated_in",
];
const COLORS: Record<EntityCategory, string> = {
  person: "#00D5FF", organization: "#3478FF", location: "#8B78FF",
  project: "#FFB547", event: "#FF5B66", document: "#42DDA0",
};

export default function GraphPage() {
  const activeId = useInvestigationStore((s) => s.activeId);
  const { local: localEntities, deleted: deletedEntities } = useEntityStore();
  const { local: localRels, deleted: deletedRels } = useRelationshipStore();
  const all = useMemo(() => allEntities(localEntities, deletedEntities), [localEntities, deletedEntities]);
  const rels = useMemo(() => allRelationships(localRels, deletedRels), [localRels, deletedRels]);
  const entities = all.filter((e) => e.investigationId === activeId);
  const relationships = rels.filter((r) => r.investigationId === activeId);

  const [hidden, setHidden] = useState<EntityCategory[]>([]);
  const [hiddenRel, setHiddenRel] = useState<RelationshipType[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [view, setView] = useState<"3d" | "2d">("3d");
  const [resetKey, setResetKey] = useState(0);

  const shown = entities.filter((e) => !hidden.includes(e.category) && (!search || e.name.toLowerCase().includes(search.toLowerCase())));
  const ids = new Set(shown.map((e) => e.id));
  const edges = relationships.filter((r) => !hiddenRel.includes(r.type) && ids.has(r.source) && ids.has(r.target));
  const path = selected.length === 2 ? shortestPath(edges, selected[0], selected[1]) : null;
  const pathEdges = path?.edges.map((e) => e.id) ?? [];
  const pathNodes = path?.nodes ?? [];
  const positions = forceLayout(shown, edges);
  const selectedEntities = selected.map((id) => entities.find((e) => e.id === id)).filter(Boolean);

  const select = (id: string) => setSelected((s) =>
    s.includes(id) ? s.filter((x) => x !== id) : s.length >= 2 ? [s[1], id] : [...s, id]);

  return (
    <>
      <ModuleHeader eyebrow="Analysis / Connection Graph" title="Connection Graph"
        description="Interactive 3D intelligence network with deterministic layout and BFS shortest-path analysis."
        actions={<Badge tone="cyan">{shown.length} nodes · {edges.length} edges</Badge>} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel title={view === "3d" ? "3D network" : "2D network"} eyebrow="Visualization" contentClassName="p-0" actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-panel-border px-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find entity…"
                className="h-8 w-24 bg-transparent text-xs outline-none" />
            </div>
            <Button size="sm" variant={view === "3d" ? "primary" : "secondary"} onClick={() => setView("3d")}>3D</Button>
            <Button size="sm" variant={view === "2d" ? "primary" : "secondary"} onClick={() => setView("2d")}>2D</Button>
            <Button size="sm" variant="ghost" aria-label="Reset camera" icon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={() => { setResetKey((k) => k + 1); setSelected([]); }} />
          </div>
        }>
          <div className="bg-grid h-[520px] overflow-hidden rounded-b-xl">
            {shown.length === 0 ? <EmptyState className="m-8" title="No visible entities" /> : view === "3d" ? (
              <Graph3D entities={shown} relationships={edges} selected={selected} pathNodes={pathNodes}
                pathEdges={pathEdges} onSelect={select} resetKey={resetKey} />
            ) : (
              <svg viewBox="-16 -14 32 28" className="h-full w-full" aria-label="2D connection graph">
                {edges.map((r) => {
                  const a = positions.get(r.source), b = positions.get(r.target);
                  if (!a || !b) return null;
                  return <line key={r.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={pathEdges.includes(r.id) ? "#FFB547" : "#1C2B3A"} strokeWidth={pathEdges.includes(r.id) ? 0.25 : 0.08} />;
                })}
                {shown.map((e) => {
                  const p = positions.get(e.id); if (!p) return null;
                  const hot = selected.includes(e.id) || pathNodes.includes(e.id);
                  return <circle key={e.id} cx={p.x} cy={p.y} r={hot ? 0.7 : 0.42}
                    fill={hot ? "#FFB547" : COLORS[e.category]} onClick={() => select(e.id)} className="cursor-pointer" />;
                })}
              </svg>
            )}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Selection & path" eyebrow="Analysis">
            {selectedEntities.length === 0 ? (
              <p className="text-xs text-text-secondary">Select one node to inspect it, or two to calculate the shortest connection path (BFS).</p>
            ) : (
              <div className="space-y-3">
                {selectedEntities.map((e) => e && (
                  <div key={e.id} className="rounded-lg border border-panel-border p-2.5">
                    <p className="text-xs text-text-primary">{e.name}</p>
                    <p className="font-mono text-[0.65rem] text-text-muted">{e.id} · {e.category}</p>
                  </div>
                ))}
                {selected.length === 2 && (
                  path ? (
                    <div>
                      <p className="gt-label mb-1 text-success">Path found · {path.edges.length} hops</p>
                      <ol className="space-y-1 text-[0.7rem] text-text-secondary">
                        {path.nodes.map((id, i) => (
                          <li key={id}>{i + 1}. {entities.find((e) => e.id === id)?.name ?? id}
                            {path.edges[i] && <span className="text-cyan"> — {path.edges[i].label}</span>}</li>
                        ))}
                      </ol>
                    </div>
                  ) : <p className="text-xs text-amber">No connection path exists within the visible graph.</p>
                )}
              </div>
            )}
          </Panel>
          <Panel title="Filters" eyebrow="Display">
            <p className="gt-label mb-2">Entity categories</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setHidden((h) => h.includes(c) ? h.filter((x) => x !== c) : [...h, c])}
                  className={`flex items-center gap-1 rounded border px-2 py-1 font-mono text-[0.65rem] ${hidden.includes(c) ? "border-panel-border text-text-muted" : "border-cyan/30 text-cyan"}`}>
                  {hidden.includes(c) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}{c}
                </button>
              ))}
            </div>
            <p className="gt-label mb-2 mt-4">Relationship types</p>
            <div className="flex flex-wrap gap-1.5">
              {REL_TYPES.map((t) => (
                <button key={t} onClick={() => setHiddenRel((h) => h.includes(t) ? h.filter((x) => x !== t) : [...h, t])}
                  className={`rounded border px-2 py-1 font-mono text-[0.6rem] ${hiddenRel.includes(t) ? "border-panel-border text-text-muted" : "border-intel-blue/30 text-intel-blue"}`}>{t}</button>
              ))}
            </div>
            {view === "3d" && <p className="mt-4 text-[0.7rem] leading-relaxed text-text-muted">Drag to rotate · scroll to zoom · right-drag to pan.</p>}
          </Panel>
          <Panel title="Legend" eyebrow="Node types">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <span key={c} className="flex items-center gap-2 text-[0.7rem] text-text-secondary">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[c] }} />{c}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
