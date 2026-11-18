"use client";

import { useMemo, useRef, useState } from "react";
import {
  Archive, Download, FileText, Filter, Search, ShieldCheck, Trash2, Upload, X,
} from "lucide-react";
import { Badge, Button, EmptyState, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { useEvidenceStore } from "@/stores/evidence-store";
import { useInvestigationStore } from "@/stores/investigation-store";
import type { EvidenceDocument } from "@/types";

const toneFor: Record<EvidenceDocument["type"], "cyan" | "blue" | "violet" | "amber"> = {
  txt: "cyan", csv: "blue", json: "violet", md: "amber",
};

export default function EvidencePage() {
  const { items, importFiles, remove } = useEvidenceStore();
  const activeId = useInvestigationStore((s) => s.activeId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<EvidenceDocument | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    const list = items.filter(
      (e) =>
        (category === "all" || e.category === category) &&
        (!q || e.filename.toLowerCase().includes(q) || e.content.toLowerCase().includes(q)),
    );
    return list.sort((a, b) =>
      sort === "name" ? a.filename.localeCompare(b.filename)
        : sort === "size" ? b.content.length - a.content.length
          : b.importedAt.localeCompare(a.importedAt),
    );
  }, [items, search, category, sort]);

  const handleFiles = async (files: FileList | File[]) => {
    const r = await importFiles(files, activeId);
    setNotice(`${r.added} item(s) indexed${r.errors.length ? ` · ${r.errors.join("; ")}` : ""}`);
  };

  const exportMetadata = () => {
    const blob = new Blob([JSON.stringify(items.map(({ content, ...m }) => m), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ghosttrace-evidence-metadata.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ModuleHeader
        eyebrow="Intelligence / Evidence Vault"
        title="Evidence Vault"
        description="Local evidence management — all files are parsed in your browser."
        actions={<Button size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={exportMetadata}>Export metadata</Button>}
      />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-success/25 bg-success/5 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        <p className="text-xs text-text-secondary">
          <span className="text-text-primary">Files are processed locally in your browser. No external upload is performed.</span>
          {" "}Supported: TXT, CSV, JSON, Markdown · maximum 2 MB per file.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); void handleFiles(e.dataTransfer.files); }}
            className={`rounded-xl border border-dashed px-6 py-8 text-center transition-colors ${
              dragging ? "border-cyan bg-cyan/5" : "border-panel-border bg-panel/40"
            }`}
          >
            <Upload className="mx-auto h-6 w-6 text-cyan" />
            <p className="mt-2 text-sm text-text-primary">Drop evidence files here</p>
            <p className="mt-1 text-xs text-text-secondary">or choose local files — contents never leave this device</p>
            <Button className="mt-4" size="sm" variant="primary" onClick={() => inputRef.current?.click()}>
              Select files
            </Button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".txt,.csv,.json,.md"
              className="hidden"
              onChange={(e) => { if (e.target.files) void handleFiles(e.target.files); e.target.value = ""; }}
            />
          </div>
          {notice && (
            <div className="flex items-center justify-between rounded-lg border border-panel-border bg-panel px-3 py-2 text-xs text-text-secondary">
              {notice}
              <button onClick={() => setNotice(null)} aria-label="Dismiss"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}

          <Panel title={`Indexed evidence (${visible.length})`} eyebrow="Vault contents" actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-panel-border px-2">
                <Search className="h-3.5 w-3.5 text-text-muted" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
                  className="h-8 w-28 bg-transparent text-xs outline-none placeholder:text-text-muted" />
              </div>
              <Filter className="h-3.5 w-3.5 text-text-muted" />
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="h-8 rounded-lg border border-panel-border bg-panel px-2 text-xs text-text-secondary">
                {["all", "memo", "report", "log", "correspondence", "registry", "note"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="h-8 rounded-lg border border-panel-border bg-panel px-2 text-xs text-text-secondary">
                <option value="newest">Newest</option><option value="name">Name</option><option value="size">Size</option>
              </select>
            </div>
          } contentClassName="p-0">
            {visible.length === 0 ? (
              <EmptyState className="m-4" icon={<Archive className="h-5 w-5" />} title="No evidence matches" description="Import files or adjust the filters above." />
            ) : (
              <ul className="divide-y divide-panel-border/60">
                {visible.map((e) => (
                  <li key={e.id}>
                    <button onClick={() => setSelected(e)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-panel-elevated/60 ${selected?.id === e.id ? "bg-cyan/5" : ""}`}>
                      <FileText className="h-4 w-4 shrink-0 text-text-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs text-text-primary">{e.filename}</p>
                        <p className="truncate font-mono text-[0.65rem] text-text-muted">{e.id} · {e.wordCount} words · {e.sourceType}</p>
                      </div>
                      <Badge tone={toneFor[e.type]}>{e.type}</Badge>
                      <Badge>{e.category}</Badge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Evidence detail" eyebrow="Inspection" contentClassName="p-4">
          {!selected ? (
            <EmptyState icon={<FileText className="h-5 w-5" />} title="Select an evidence item" description="Preview contents and inspect metadata." />
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="break-all font-mono text-sm text-cyan">{selected.filename}</p>
                  <p className="mt-1 font-mono text-[0.65rem] text-text-muted">{selected.id}</p>
                </div>
                <Button size="sm" variant="danger" icon={<Trash2 className="h-3 w-3" />}
                  onClick={() => { remove(selected.id); setSelected(null); }}>Delete</Button>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-[0.7rem]">
                {[
                  ["Type", selected.type.toUpperCase()], ["Category", selected.category],
                  ["Size", `${selected.content.length.toLocaleString()} chars`], ["Words", String(selected.wordCount)],
                  ["Imported", selected.importedAt.slice(0, 10)], ["Source", selected.sourceType],
                  ["Investigation", selected.investigationId], ["Status", "Indexed"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded border border-panel-border bg-bg-secondary/50 p-2">
                    <dt className="gt-label">{k}</dt><dd className="mt-0.5 break-all font-mono text-text-secondary">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="gt-label mb-1.5">Content preview (untrusted text)</p>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-panel-border bg-bg-primary p-3 font-mono text-[0.7rem] leading-relaxed text-text-secondary">
                  {selected.content.slice(0, 4000)}
                </pre>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
