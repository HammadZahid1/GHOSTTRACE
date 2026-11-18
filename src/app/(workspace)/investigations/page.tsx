"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Archive, Trash2, Check, RotateCcw } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { useInvestigationStore } from "@/stores/investigation-store";
import { SCENARIOS } from "@/data/scenarios";

export default function InvestigationsPage() {
  const router = useRouter();
  const { investigations, activeId, setActive, duplicate, archive, remove, reset } =
    useInvestigationStore();
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <>
      <ModuleHeader
        eyebrow="Intelligence / Investigations"
        title="Investigations"
        description="Load, duplicate, archive, or delete local fictional case files."
        actions={
          <Button variant="ghost" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
            Reset scenarios
          </Button>
        }
      />

      <div className="mb-6 gt-panel px-4 py-3">
        <p className="gt-label">Active investigation</p>
        <p className="mt-1 font-display text-base text-cyan">
          {investigations.find((i) => i.id === activeId)?.title ?? "None"}
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          {SCENARIOS.length} complete fictional datasets · each with 12 entities, 18 relationships, 16 events, and 8 evidence documents.
        </p>
      </div>

      {investigations.length === 0 ? (
        <EmptyState
          title="No investigations"
          description="Reset the workspace to restore the four fictional sample scenarios."
          action={<Button variant="primary" onClick={reset}>Restore scenarios</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {investigations.map((i) => (
            <article key={i.id} className="gt-panel flex flex-col p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] text-cyan">{i.id}</span>
                <Badge tone={i.archived ? "neutral" : "success"} dot>{i.archived ? "archived" : "active"}</Badge>
              </div>
              <h3 className="mt-2 font-display text-base font-medium">{i.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-text-secondary">{i.description}</p>
              <p className="mt-3 font-mono text-[0.65rem] text-text-muted">
                {i.category} · created {i.createdAt}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-panel-border pt-3">
                <Button size="sm" variant={activeId === i.id ? "primary" : "secondary"}
                  onClick={() => { setActive(i.id); router.push("/entities"); }}
                  icon={activeId === i.id ? <Check className="h-3 w-3" /> : undefined}>
                  {activeId === i.id ? "Loaded" : "Load"}
                </Button>
                <Button size="sm" variant="ghost" icon={<Copy className="h-3 w-3" />} onClick={() => duplicate(i.id)}>Duplicate</Button>
                <Button size="sm" variant="ghost" icon={<Archive className="h-3 w-3" />} onClick={() => archive(i.id)}>
                  {i.archived ? "Restore" : "Archive"}
                </Button>
                {confirm === i.id ? (
                  <Button size="sm" variant="danger" onClick={() => { remove(i.id); setConfirm(null); }}>Confirm delete</Button>
                ) : (
                  <Button size="sm" variant="ghost" icon={<Trash2 className="h-3 w-3" />} onClick={() => setConfirm(i.id)}>Delete</Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
