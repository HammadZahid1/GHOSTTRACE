"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, X } from "lucide-react";
import { Badge, Button, EmptyState, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { allEntities, useEntityStore } from "@/stores/entity-store";
import { allRelationships, RELATIONSHIP_TYPES, useRelationshipStore } from "@/stores/relationship-store";
import { useInvestigationStore } from "@/stores/investigation-store";
import type { Entity, EntityCategory, RelationshipType } from "@/types";

const tones: Record<EntityCategory, "cyan" | "blue" | "violet" | "amber" | "critical" | "success"> = {
  person: "cyan", organization: "blue", location: "violet",
  project: "amber", event: "critical", document: "success",
};

const blank = (investigationId: string): Entity => ({
  id: `ENT-LOCAL-${Date.now()}`, investigationId, name: "", category: "person",
  description: "", evidenceRefs: [], extractionMethod: "manual user entry",
  confidence: 1, notes: "",
});

export default function EntitiesPage() {
  const { local, deleted, upsert, remove } = useEntityStore();
  const activeId = useInvestigationStore((s) => s.activeId);
  const entities = useMemo(() => allEntities(local, deleted), [local, deleted]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<Entity | null>(null);
  const [editing, setEditing] = useState<Entity | null>(null);
  const [linkTarget, setLinkTarget] = useState("");
  const [linkType, setLinkType] = useState<RelationshipType>("associated_with");
  const { local: localRels, deleted: deletedRels, add: addRel } = useRelationshipStore();

  const visible = entities.filter((e) =>
    (category === "all" || e.category === category) &&
    (!search || e.name.toLowerCase().includes(search.toLowerCase())),
  );
  const scoped = visible.filter((e) => e.investigationId === activeId);
  const relations = selected ? allRelationships(localRels, deletedRels).filter((r) => r.source === selected.id || r.target === selected.id) : [];
  const events = selected ? EVENTS.filter((ev) => ev.entityRefs.includes(selected.id)) : [];

  return (
    <>
      <ModuleHeader
        eyebrow="Analysis / Entity Intelligence"
        title="Entity Intelligence"
        description="Explore fictional individuals, organizations, locations, projects, events, and documents."
        actions={<Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => setEditing(blank(activeId))}>New entity</Button>}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title={`Entities (${scoped.length})`} eyebrow="Registry" actions={
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-panel-border px-2">
              <Search className="h-3.5 w-3.5 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search entities…"
                className="h-8 w-36 bg-transparent text-xs outline-none" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="h-8 rounded-lg border border-panel-border bg-panel px-2 text-xs text-text-secondary">
              {["all", "person", "organization", "location", "project", "event", "document"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        } contentClassName="p-0">
          {scoped.length === 0 ? <EmptyState className="m-4" title="No entities found" /> : (
            <ul className="divide-y divide-panel-border/60">
              {scoped.map((e) => (
                <li key={e.id}>
                  <button onClick={() => setSelected(e)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-panel-elevated/60 ${selected?.id === e.id ? "bg-cyan/5" : ""}`}>
                    <span className="h-2 w-2 rounded-full" style={{ background: `var(--${({ person: "cyan", organization: "intel-blue", location: "violet", project: "amber", event: "critical", document: "success" } as const)[e.category]})` }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-text-primary">{e.name}</p>
                      <p className="font-mono text-[0.65rem] text-text-muted">{e.id}</p>
                    </div>
                    <Badge tone={tones[e.category]}>{e.category}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Entity detail" eyebrow="Inspection" contentClassName="p-4">
          {!selected ? <EmptyState icon={<Search className="h-5 w-5" />} title="Select an entity" description="Inspect relationships, evidence, and history." /> : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-base text-text-primary">{selected.name}</h3>
                  <p className="mt-1 font-mono text-[0.65rem] text-text-muted">{selected.id}</p>
                </div>
                <button onClick={() => { remove(selected.id); setSelected(null); }} aria-label="Delete entity" className="text-text-muted hover:text-critical"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="flex flex-wrap gap-1.5"><Badge tone={tones[selected.category]}>{selected.category}</Badge><Badge tone="success">extraction: {(selected.confidence * 100).toFixed(0)}% reliable</Badge></div>
              <p className="text-xs leading-relaxed text-text-secondary">{selected.description}</p>
              <p className="gt-label">Extraction method · {selected.extractionMethod}</p>
              <div>
                <p className="gt-label mb-1">Evidence references</p>
                <div className="flex flex-wrap gap-1.5">{selected.evidenceRefs.map((r) => <Badge key={r}>{r}</Badge>)}</div>
              </div>
              <div>
                <p className="gt-label mb-1">Relationships ({relations.length})</p>
                <ul className="space-y-1">{relations.slice(0, 8).map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded border border-panel-border px-2 py-1 text-[0.7rem]">
                    <span className="text-text-secondary">{r.label}</span><span className="font-mono text-text-muted">{r.type}</span>
                  </li>
                ))}</ul>
                <div className="mt-2 flex gap-2">
                  <select value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)}
                    className="h-8 min-w-0 flex-1 rounded border border-panel-border bg-panel px-2 text-[0.7rem]">
                    <option value="">Link to entity…</option>
                    {entities.filter((e) => e.id !== selected.id).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                  <select value={linkType} onChange={(e) => setLinkType(e.target.value as RelationshipType)}
                    className="h-8 rounded border border-panel-border bg-panel px-2 text-[0.7rem]">
                    {RELATIONSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <Button size="sm" variant="primary" onClick={() => {
                    if (!linkTarget) return;
                    addRel({ id: `REL-LOCAL-${Date.now()}`, investigationId: activeId,
                      source: selected.id, target: linkTarget, type: linkType,
                      label: linkType.replaceAll("_", " "), evidenceRefs: [] });
                    setLinkTarget("");
                  }}>Link</Button>
                </div>
              </div>
              <div>
                <p className="gt-label mb-1">Event history ({events.length})</p>
                <ul className="space-y-1">{events.slice(0, 8).map((ev) => (
                  <li key={ev.id} className="text-[0.7rem] text-text-secondary">· {ev.date ?? "undated"} — {ev.title}</li>
                ))}</ul>
              </div>
              <textarea value={selected.notes} onChange={(e) => {
                const updated = { ...selected, notes: e.target.value }; setSelected(updated); upsert(updated);
              }} placeholder="Analyst notes…" rows={3}
                className="w-full rounded-lg border border-panel-border bg-bg-primary p-2 text-xs text-text-secondary outline-none focus:border-cyan/40" />
              <Button size="sm" variant="secondary" onClick={() => setEditing(selected)}>Edit entity</Button>
              <Link href={`/graph?entity=${selected.id}`} className="gt-label block hover:text-cyan">Open in connection graph →</Link>
            </div>
          )}
        </Panel>
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur" onClick={() => setEditing(null)} />
          <div className="gt-panel-elevated relative w-full max-w-lg space-y-3 p-5">
            <div className="flex items-center justify-between"><p className="gt-label text-cyan">Entity editor</p>
              <button onClick={() => setEditing(null)} aria-label="Close"><X className="h-4 w-4 text-text-muted" /></button></div>
            {(["name", "description", "notes"] as const).map((field) => (
              <label key={field} className="block">
                <span className="gt-label">{field}</span>
                <input value={editing[field]} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-panel-border bg-bg-primary px-3 text-xs outline-none focus:border-cyan/50" />
              </label>
            ))}
            <label className="block"><span className="gt-label">category</span>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as EntityCategory })}
                className="mt-1 h-9 w-full rounded-lg border border-panel-border bg-bg-primary px-3 text-xs">
                {["person", "organization", "location", "project", "event", "document"].map((c) => <option key={c}>{c}</option>)}
              </select></label>
            <Button variant="primary" onClick={() => { if (editing.name.trim()) { upsert(editing); setSelected(editing); setEditing(null); } }}>Save entity</Button>
          </div>
        </div>
      )}
    </>
  );
}
