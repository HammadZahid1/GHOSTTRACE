"use client";

import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Badge, Button, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { SCENARIOS } from "@/data/scenarios";
import { buildReport, reportToMarkdown, SECTION_OPTIONS } from "@/engines/reports";
import { useInvestigationStore } from "@/stores/investigation-store";
import type { InvestigationReport } from "@/engines/reports";

export default function ReportsPage() {
  const activeId = useInvestigationStore((s) => s.activeId);
  const scenario = SCENARIOS.find((s) => s.investigation.id === activeId) ?? SCENARIOS[0];
  const [title, setTitle] = useState(`${scenario.investigation.title} — Investigation Summary`);
  const [included, setIncluded] = useState<string[]>(SECTION_OPTIONS.map((s) => s.key));
  const [notes, setNotes] = useState("");
  const [report, setReport] = useState<InvestigationReport | null>(null);

  const exportReport = (format: "md" | "json") => {
    if (!report) return;
    const data = format === "md" ? reportToMarkdown(report) : JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: format === "md" ? "text/markdown" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `ghosttrace-report.${format}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ModuleHeader eyebrow="Workspace / Report Generator" title="Report Generator"
        description="Structured reports generated from the active local investigation data."
        actions={<div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={<Download className="h-3.5 w-3.5" />} onClick={() => exportReport("md")}>Markdown</Button>
          <Button size="sm" variant="secondary" icon={<Download className="h-3.5 w-3.5" />} onClick={() => exportReport("json")}>JSON</Button>
          <Button size="sm" variant="primary" icon={<Printer className="h-3.5 w-3.5" />} onClick={() => window.print()}>Print</Button>
        </div>} />

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel title="Report setup" eyebrow="Configuration">
            <label className="block"><span className="gt-label">Report title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                className="mt-1 h-9 w-full rounded border border-panel-border bg-bg-primary px-3 text-xs outline-none focus:border-cyan/40" /></label>
            <p className="gt-label mb-2 mt-4">Included sections</p>
            <div className="space-y-1">
              {SECTION_OPTIONS.map((s) => (
                <label key={s.key} className="flex items-center gap-2 text-xs text-text-secondary">
                  <input type="checkbox" checked={included.includes(s.key)} onChange={() =>
                    setIncluded((list) => list.includes(s.key) ? list.filter((x) => x !== s.key) : [...list, s.key])} />
                  {s.title}
                  <Badge className="ml-auto" tone={s.kind === "source" ? "success" : s.kind === "detected" ? "cyan" : s.kind === "hypothesis" ? "amber" : "neutral"}>{s.kind}</Badge>
                </label>
              ))}
            </div>
            <label className="mt-4 block"><span className="gt-label">Analyst notes (unverified)</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
                className="mt-1 w-full rounded border border-panel-border bg-bg-primary p-2 text-xs outline-none" /></label>
            <Button className="mt-4 w-full" variant="primary" icon={<FileText className="h-4 w-4" />}
              onClick={() => setReport(buildReport(scenario, title, included, notes))}>Generate report</Button>
          </Panel>
        </div>

        <Panel title="Report preview" eyebrow="Document" contentClassName="p-8">
          {!report ? (
            <div className="py-20 text-center">
              <FileText className="mx-auto h-8 w-8 text-cyan/50" />
              <p className="mt-4 text-sm text-text-secondary">Configure sections and generate a report.</p>
            </div>
          ) : (
            <article className="mx-auto max-w-3xl space-y-5">
              <div className="border-b border-panel-border pb-4">
                <p className="gt-label text-cyan">Ghosttrace Intelligence Investigation System</p>
                <h1 className="mt-2 font-display text-3xl font-semibold">{report.title}</h1>
                <p className="mt-2 font-mono text-xs text-text-muted">{report.investigationId} · {new Date(report.generatedAt).toLocaleString()}</p>
                <p className="mt-3 text-xs text-amber">Educational demonstration — all evidence is fictional. Patterns are not verified facts.</p>
              </div>
              {report.sections.map((s) => (
                <section key={s.key} className="break-inside-avoid">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-display text-lg font-medium">{s.title}</h2>
                    <Badge tone={s.kind === "source" ? "success" : s.kind === "detected" ? "cyan" : s.kind === "hypothesis" ? "amber" : "neutral"}>
                      {s.kind === "source" ? "source-backed" : s.kind === "detected" ? "detected pattern" : s.kind === "hypothesis" ? "unverified" : "methodology"}
                    </Badge>
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-text-secondary">{s.body}</pre>
                </section>
              ))}
              <div className="border-t border-panel-border pt-4">
                <p className="gt-label">Analytical limitations</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-text-muted">{report.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
            </article>
          )}
        </Panel>
      </div>
    </>
  );
}
