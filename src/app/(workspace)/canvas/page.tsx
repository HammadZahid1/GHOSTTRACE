"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileText, Group, Link2, Plus, RotateCcw, StickyNote, Trash2 } from "lucide-react";
import { Badge, Button, EmptyState, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { SCENARIOS } from "@/data/scenarios";
import { useCanvasStore } from "@/stores/canvas-store";
import { useInvestigationStore } from "@/stores/investigation-store";
import type { CanvasKind, CanvasNode } from "@/stores/canvas-store";

const KIND_COLOR: Record<CanvasKind, string> = {
  evidence: "#00D5FF", entity: "#3478FF", event: "#FFB547", note: "#8B78FF", group: "#42DDA0",
};
const KIND_ICON: Record<CanvasKind, typeof FileText> = {
  evidence: FileText, entity: Link2, event: RotateCcw, note: StickyNote, group: Group,
};

export default function CanvasPage() {
  const { nodes, edges, setNodes, addNode, removeNode, addEdge, reset } = useCanvasStore();
  const activeId = useInvestigationStore((s) => s.activeId);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [connect, setConnect] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const box = canvasRef.current?.getBoundingClientRect();
      const scale = zoom / 100;
      const x = (e.clientX - (box?.left ?? 0)) / scale - d.dx - pan.x / scale;
      const y = (e.clientY - (box?.top ?? 0)) / scale - d.dy - pan.y / scale;
      setNodes(nodes.map((n) => n.id === d.id ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n));
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [nodes, pan, setNodes, zoom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 1800);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const create = (kind: CanvasKind) => {
    const titles: Record<CanvasKind, string> = {
      evidence: "New evidence card", entity: "New entity card", event: "New event card",
      note: "Analyst note", group: "New group",
    };
    addNode({ id: `CAN-${Date.now()}`, kind, title: titles[kind], body: "", x: 80 + nodes.length * 25, y: 80 + nodes.length * 18 });
  };

  const populate = () => {
    const s = SCENARIOS.find((x) => x.investigation.id === activeId) ?? SCENARIOS[0];
    s.evidence.slice(0, 3).forEach((e, i) => addNode({ id: `CAN-EV-${Date.now()}-${i}`, kind: "evidence", title: e.filename, body: e.content.slice(0, 140), x: 60 + i * 220, y: 80 }));
    s.entities.slice(0, 3).forEach((e, i) => addNode({ id: `CAN-EN-${Date.now()}-${i}`, kind: "entity", title: e.name, body: e.category, x: 60 + i * 220, y: 300 }));
    s.events.slice(0, 2).forEach((e, i) => addNode({ id: `CAN-TM-${Date.now()}-${i}`, kind: "event", title: e.title, body: e.date ?? "unverified time", x: 60 + i * 220, y: 520 }));
  };

  const exportCanvas = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ghosttrace-canvas.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const nodeClick = (id: string) => {
    setSelected(id);
    if (connect.length === 0) setConnect([id]);
    else if (connect.length === 1 && connect[0] !== id) {
      addEdge({ id: `EDGE-${Date.now()}`, from: connect[0], to: id, label: "linked" });
      setConnect([]);
    } else setConnect([]);
  };

  return (
    <>
      <ModuleHeader eyebrow="Workspace / Investigation Canvas" title="Investigation Canvas"
        description="Arrange evidence, entities, events, and notes on a local visual workspace."
        actions={<div className="flex flex-wrap items-center gap-2">
          {saved && <Badge tone="success">saved locally</Badge>}
          <Button size="sm" variant="ghost" onClick={populate}>Populate from scenario</Button>
          <Button size="sm" variant="ghost" icon={<Download className="h-3.5 w-3.5" />} onClick={exportCanvas}>Export</Button>
          <Button size="sm" variant="danger" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>Reset</Button>
        </div>} />

      <div className="mb-3 flex flex-wrap gap-2">
        {(["evidence", "entity", "event", "note", "group"] as const).map((k) => {
          const Icon = KIND_ICON[k];
          return <Button key={k} size="sm" variant="secondary" icon={<Icon className="h-3.5 w-3.5" />} onClick={() => create(k)}>Add {k}</Button>;
        })}
        <Button size="sm" variant={connect.length ? "primary" : "secondary"} icon={<Link2 className="h-3.5 w-3.5" />}
          onClick={() => setConnect([])}>{connect.length ? "Select target node…" : "Connect nodes"}</Button>
        <div className="ml-auto flex items-center gap-1 text-xs text-text-muted">
          <button onClick={() => setZoom((z) => Math.max(50, z - 10))} aria-label="Zoom out">−</button>
          <span className="w-12 text-center font-mono">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(160, z + 10))} aria-label="Zoom in">+</button>
          <button className="ml-2 hover:text-cyan" onClick={() => { setZoom(100); setPan({ x: 0, y: 0 }); }}>Reset view</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div ref={canvasRef} className="bg-grid relative h-[620px] overflow-auto rounded-xl border border-panel-border bg-bg-secondary">
          {nodes.length === 0 ? (
            <EmptyState className="m-12" icon={<Plus className="h-5 w-5" />} title="Canvas is empty"
              description="Add cards or populate the canvas from the active scenario." />
          ) : (
            <div style={{ transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`, transformOrigin: "0 0" }}
              className="relative h-full w-full">
              <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
                {edges.map((e) => {
                  const a = nodes.find((n) => n.id === e.from), b = nodes.find((n) => n.id === e.to);
                  if (!a || !b) return null;
                  return <line key={e.id} x1={a.x + 90} y1={a.y + 30} x2={b.x + 90} y2={b.y + 30} stroke="#00D5FF" strokeOpacity="0.45" strokeWidth="1.5" />;
                })}
              </svg>
              {nodes.map((n) => (
                <div key={n.id}
                  onMouseDown={(e) => {
                    const box = canvasRef.current!.getBoundingClientRect();
                    dragRef.current = { id: n.id, dx: e.clientX - box.left - n.x * (zoom / 100), dy: e.clientY - box.top - n.y * (zoom / 100) };
                  }}
                  onClick={() => nodeClick(n.id)}
                  className={`absolute w-44 cursor-move rounded-lg border bg-panel p-3 shadow-lg ${selected === n.id || connect.includes(n.id) ? "border-cyan" : "border-panel-border"}`}
                  style={{ left: n.x, top: n.y, borderTopColor: KIND_COLOR[n.kind], borderTopWidth: 2 }}>
                  <p className="truncate text-xs font-medium" style={{ color: KIND_COLOR[n.kind] }}>{n.title}</p>
                  <p className="gt-label mt-1">{n.kind}</p>
                  <p className="mt-1 line-clamp-3 text-[0.65rem] leading-snug text-text-secondary">{n.body || "—"}</p>
                  <button className="mt-2 text-text-muted hover:text-critical" onClick={(e) => { e.stopPropagation(); removeNode(n.id); }} aria-label="Remove card"><Trash2 className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Panel title="Card inspector" eyebrow="Workspace">
            {!selected ? <p className="text-xs text-text-secondary">Select a card to edit it. Ctrl/Cmd + S saves locally.</p> : (() => {
              const node = nodes.find((n) => n.id === selected);
              if (!node) return null;
              return <div className="space-y-2">
                <input value={node.title} onChange={(e) => setNodes(nodes.map((n) => n.id === node.id ? { ...n, title: e.target.value } : n))}
                  className="h-8 w-full rounded border border-panel-border bg-bg-primary px-2 text-xs outline-none" />
                <textarea value={node.body} rows={5} onChange={(e) => setNodes(nodes.map((n) => n.id === node.id ? { ...n, body: e.target.value } : n))}
                  className="w-full rounded border border-panel-border bg-bg-primary p-2 text-xs outline-none" />
                <p className="gt-label">x {Math.round(node.x)} · y {Math.round(node.y)}</p>
              </div>;
            })()}
          </Panel>
          <Panel title="Minimap" eyebrow="Overview">
            <div className="relative h-32 overflow-hidden rounded border border-panel-border bg-bg-primary">
              {nodes.map((n) => (
                <span key={n.id} className="absolute h-1.5 w-3 rounded-sm" style={{ left: `${Math.min(96, n.x / 8)}%`, top: `${Math.min(90, n.y / 8)}%`, background: KIND_COLOR[n.kind] }} />
              ))}
            </div>
          </Panel>
          <Panel title="Shortcuts" eyebrow="Help">
            <ul className="space-y-1 font-mono text-[0.7rem] text-text-secondary">
              <li>Drag card — reposition</li><li>Click two cards — connect</li>
              <li>Ctrl/Cmd + S — save state</li><li>+/− — zoom controls</li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
