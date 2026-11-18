"use client";

import { useMemo, useState } from "react";
import { Download, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Badge, Button, EmptyState, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { EVENTS } from "@/data/scenarios";
import { useDebounced } from "@/hooks/useDebounced";
import { filterEvents, groupByMonth, sortEvents } from "@/engines/timeline";
import { useTimelineStore } from "@/stores/timeline-store";
import { useInvestigationStore } from "@/stores/investigation-store";
import type { TimelineEvent } from "@/types";

const blank = (investigationId: string): TimelineEvent => ({
  id: `EV-LOCAL-${Date.now()}`, investigationId, title: "", description: "", date: null,
  category: "observation", evidenceRefs: [], entityRefs: [], source: "user entry",
  status: "unverified", ambiguousTime: true,
});

export default function TimelinePage() {
  const { local, deleted, upsert, remove } = useTimelineStore();
  const activeId = useInvestigationStore((s) => s.activeId);
  const all = useMemo(() => [...EVENTS.filter((e) => !deleted.includes(e.id)), ...local], [deleted, local]);
  const scoped = all.filter((e) => e.investigationId === activeId);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [view, setView] = useState<"horizontal" | "vertical">("vertical");
  const [zoom, setZoom] = useState(100);
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const [editing, setEditing] = useState<TimelineEvent | null>(null);
  const debouncedQuery = useDebounced(query);

  const filtered = filterEvents(scoped, { query: debouncedQuery, category, from, to });
  const events = sortEvents(filtered, direction);
  const groups = groupByMonth(events);

  const exportTimeline = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ghosttrace-timeline.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const review = (e: TimelineEvent) => {
    const updated: TimelineEvent = { ...e, status: e.status === "verified" ? "review" : "verified" };
    upsert(updated); setSelected(updated);
  };

  /** Reorder by swapping assigned timestamps with the adjacent event. */
  const reorder = (e: TimelineEvent, delta: number) => {
    const i = events.findIndex((x) => x.id === e.id);
    const other = events[i + delta];
    if (!other || !e.date || !other.date) return;
    const first: TimelineEvent = { ...e, date: other.date };
    const second: TimelineEvent = { ...other, date: e.date };
    upsert(first); upsert(second); setSelected(first);
  };

  const undated = scoped.filter((e) => !e.date).length;
  const reviewed = scoped.filter((e) => e.status === "verified").length;
  const coverage = scoped.length ? Math.round((reviewed / scoped.length) * 100) : 0;

  return (
    <>
      <ModuleHeader eyebrow="Analysis / Timeline Reconstruction" title="Timeline Reconstruction"
        description="Chronological investigation workspace with explicit unverified-time states."
        actions={<Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setEditing(blank(activeId))}>New event</Button>} />

      <div className="mb-4 gt-panel flex flex-wrap items-center gap-2 px-3 py-2.5">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events…"
          className="h-8 w-40 rounded border border-panel-border bg-panel px-2 text-xs outline-none" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="h-8 rounded border border-panel-border bg-panel px-2 text-xs text-text-secondary">
          {["all", "document", "meeting", "transaction", "communication", "system", "observation"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
          className="h-8 rounded border border-panel-border bg-panel px-2 text-xs text-text-secondary" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
          className="h-8 rounded border border-panel-border bg-panel px-2 text-xs text-text-secondary" />
        <Button size="sm" variant="ghost" onClick={() => setDirection(direction === "asc" ? "desc" : "asc")}>
          {direction === "asc" ? "Oldest first ↑" : "Newest first ↓"}
        </Button>
        <Button size="sm" variant={view === "horizontal" ? "primary" : "ghost"} onClick={() => setView("horizontal")}>Horizontal</Button>
        <Button size="sm" variant={view === "vertical" ? "primary" : "ghost"} onClick={() => setView("vertical")}>Vertical</Button>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <button onClick={() => setZoom((z) => Math.max(70, z - 10))} aria-label="Zoom out">−</button>
          <span className="font-mono">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(150, z + 10))} aria-label="Zoom in">+</button>
        </div>
        <Button size="sm" variant="ghost" icon={<Download className="h-3.5 w-3.5" />} onClick={exportTimeline}>Export</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title={`Events (${events.length})`} eyebrow="Reconstruction" contentClassName={`p-4 ${view === "horizontal" ? "overflow-x-auto" : ""}`}>
          {events.length === 0 ? <EmptyState title="No events match" /> : view === "vertical" ? (
            <div className="space-y-4" style={{ fontSize: `${zoom}%` }}>
              {[...groups.entries()].map(([month, list]) => (
                <div key={month}>
                  <p className="gt-label mb-2 border-b border-panel-border pb-1">{month}</p>
                  <ol className="relative ml-3 border-l border-panel-border pl-5">
                    {list.map((e) => (
                      <li key={e.id} className="relative mb-3">
                        <span className={`absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full ${e.ambiguousTime ? "bg-amber/50 ring-1 ring-amber" : "bg-cyan"}`} />
                        <button onClick={() => setSelected(e)}
                          className={`w-full rounded-lg border px-3 py-2 text-left ${selected?.id === e.id ? "border-cyan/40 bg-cyan/5" : "border-panel-border bg-panel/50 hover:border-cyan/25"}`}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-text-primary">{e.title}</span>
                            <span className="font-mono text-[0.65rem] text-text-muted">{e.date ?? "UNVERIFIED TIME"}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[0.7rem] text-text-secondary">{e.description}</p>
                          <div className="mt-1.5 flex gap-1.5"><Badge tone={e.status === "verified" ? "success" : e.status === "review" ? "amber" : "critical"}>{e.status}</Badge><Badge>{e.category}</Badge></div>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-w-max gap-3 pb-3">
              {events.map((e) => (
                <button key={e.id} onClick={() => setSelected(e)}
                  className={`w-48 shrink-0 rounded-lg border p-3 text-left ${selected?.id === e.id ? "border-cyan/40 bg-cyan/5" : "border-panel-border bg-panel/50"}`}>
                  <p className="font-mono text-[0.65rem] text-cyan">{e.date ?? "unverified"}</p>
                  <p className="mt-1 text-xs text-text-primary">{e.title}</p>
                  <Badge className="mt-2" tone={e.status === "verified" ? "success" : "amber"}>{e.status}</Badge>
                </button>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Chronology check" eyebrow="Analysis">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-text-secondary">Total events</span><span className="font-mono text-text-primary">{scoped.length}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Unverified time</span><span className="font-mono text-amber">{undated}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Review coverage</span><span className="font-mono text-success">{coverage}%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-panel-border"><div className="h-full bg-success" style={{ width: `${coverage}%` }} /></div>
            <p className="pt-1 text-[0.7rem] leading-relaxed text-text-muted">Undated events are never assigned invented precision. Ambiguity remains visible in every view.</p>
          </div>
        </Panel>
        <Panel title="Event detail" eyebrow="Inspection" contentClassName="p-4">
          {!selected ? <EmptyState title="Select an event" description="Inspect sources, entities, and review state." /> : (
            <div className="space-y-3">
              <h3 className="font-display text-base">{selected.title}</h3>
              <p className="font-mono text-[0.7rem] text-cyan">{selected.date ?? "Unverified time — no timestamp assigned"}</p>
              <p className="text-xs leading-relaxed text-text-secondary">{selected.description}</p>
              <div className="flex flex-wrap gap-1.5"><Badge tone={selected.status === "verified" ? "success" : "amber"}>{selected.status}</Badge><Badge>{selected.category}</Badge></div>
              <div className="grid grid-cols-2 gap-2 text-[0.7rem]">
                <div className="rounded border border-panel-border p-2"><p className="gt-label">Source</p><p className="font-mono text-text-secondary">{selected.source}</p></div>
                <div className="rounded border border-panel-border p-2"><p className="gt-label">Event ID</p><p className="font-mono text-text-secondary">{selected.id}</p></div>
              </div>
              <div><p className="gt-label mb-1">Evidence</p><div className="flex flex-wrap gap-1">{selected.evidenceRefs.map((r) => <Badge key={r}>{r}</Badge>)}</div></div>
              <div><p className="gt-label mb-1">Entities</p><div className="flex flex-wrap gap-1">{selected.entityRefs.map((r) => <Badge key={r} tone="blue">{r}</Badge>)}</div></div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => review(selected)} icon={<RotateCcw className="h-3 w-3" />}>Toggle reviewed</Button>
                <Button size="sm" variant="ghost" icon={<Pencil className="h-3 w-3" />} onClick={() => setEditing(selected)}>Edit</Button>
                <Button size="sm" variant="danger" icon={<Trash2 className="h-3 w-3" />} onClick={() => { remove(selected.id); setSelected(null); }}>Delete</Button>
              </div>
              <div>
                <p className="gt-label mb-1">Reorder assigned timestamps</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => reorder(selected, -1)}>↑ Earlier neighbor</Button>
                  <Button size="sm" variant="ghost" onClick={() => reorder(selected, 1)}>↓ Later neighbor</Button>
                </div>
                <p className="mt-1 text-[0.65rem] leading-relaxed text-text-muted">Compares assigned timestamps and swaps them with the adjacent event. Unverified times are never altered.</p>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur" onClick={() => setEditing(null)} />
          <div className="gt-panel-elevated relative w-full max-w-lg space-y-3 p-5">
            <p className="gt-label text-cyan">Event editor</p>
            <label className="block"><span className="gt-label">title</span>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="mt-1 h-9 w-full rounded border border-panel-border bg-bg-primary px-3 text-xs outline-none" /></label>
            <label className="block"><span className="gt-label">description</span>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3}
                className="mt-1 w-full rounded border border-panel-border bg-bg-primary p-3 text-xs outline-none" /></label>
            <label className="block"><span className="gt-label">date (leave empty for unverified time)</span>
              <input type="date" value={editing.date ?? ""} onChange={(e) => {
                const date = e.target.value || null;
                setEditing({ ...editing, date, ambiguousTime: date === null, status: date === null ? "unverified" : editing.status });
              }} className="mt-1 h-9 w-full rounded border border-panel-border bg-bg-primary px-3 text-xs outline-none" /></label>
            <label className="block"><span className="gt-label">category</span>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as TimelineEvent["category"] })}
                className="mt-1 h-9 w-full rounded border border-panel-border bg-bg-primary px-3 text-xs">
                {["document", "meeting", "transaction", "communication", "system", "observation"].map((c) => <option key={c}>{c}</option>)}
              </select></label>
            <Button variant="primary" onClick={() => { if (editing.title.trim()) { upsert(editing); setSelected(editing); setEditing(null); } }}>Save event</Button>
          </div>
        </div>
      )}
    </>
  );
}
