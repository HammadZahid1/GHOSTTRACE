"use client";

import { useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AlertTriangle, Info } from "lucide-react";
import { Badge, Panel } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { SCENARIOS } from "@/data/scenarios";
import { detectPatterns } from "@/engines/pattern-detection";
import { useInvestigationStore } from "@/stores/investigation-store";

const COLOR = ["#00D5FF", "#3478FF", "#8B78FF", "#FFB547", "#FF5B66", "#42DDA0"];

export default function PatternsPage() {
  const activeId = useInvestigationStore((s) => s.activeId);
  const setActive = useInvestigationStore((s) => s.setActive);
  const scenario = SCENARIOS.find((s) => s.investigation.id === activeId) ?? SCENARIOS[0];
  const [metric, setMetric] = useState<"repeatedTerms" | "eventFrequency" | "relationshipFrequency" | "temporalClusters">("repeatedTerms");

  const report = useMemo(
    () => detectPatterns(scenario.evidence, scenario.entities, scenario.events, scenario.relationships),
    [scenario],
  );
  const chartData = report[metric].map((r) => {
    const item = r as Record<string, string | number>;
    return { name: String(item.term ?? item.key ?? item.month ?? item.date), value: Number(item.count) };
  });

  return (
    <>
      <ModuleHeader eyebrow="Analysis / Pattern Observatory" title="Pattern Observatory"
        description="Frequency, co-occurrence, and temporal analytics computed from the selected fictional dataset."
        actions={<select value={scenario.investigation.id} onChange={(e) => setActive(e.target.value)}
          className="h-9 rounded-lg border border-panel-border bg-panel px-3 text-xs text-text-secondary">
          {SCENARIOS.map((s) => <option key={s.investigation.id} value={s.investigation.id}>{s.investigation.title}</option>)}
        </select>} />

      <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber/30 bg-amber/5 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
        <p className="text-xs leading-relaxed text-text-secondary">
          <span className="text-text-primary">A detected correlation is not proof of causation.</span>
          {" "}A shared keyword or repeated reference does not establish a relationship between people.
          All patterns below are counts, not verified facts.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Panel title="Distribution" eyebrow="Visualization" actions={
            <div className="flex flex-wrap gap-1.5">
              {([
                ["repeatedTerms", "Terms"], ["eventFrequency", "Events"],
                ["relationshipFrequency", "Relations"], ["temporalClusters", "Timeline"],
              ] as const).map(([k, l]) => (
                <button key={k} onClick={() => setMetric(k)}
                  className={`rounded border px-2 py-1 font-mono text-[0.65rem] ${metric === k ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-panel-border text-text-muted"}`}>{l}</button>
              ))}
            </div>
          }>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid stroke="#1C2B3A" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={70} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#0D131C", border: "1px solid #1C2B3A", fontSize: 12 }} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLOR[i % COLOR.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[0.7rem] text-text-muted"><Info className="mt-0.5 h-3 w-3 shrink-0" />{report.explanations[metric]}</p>
          </Panel>

          <Panel title="Co-occurrence matrix" eyebrow="Term pairs" contentClassName="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="gt-label"><th className="p-2 text-left">Term A</th><th className="p-2 text-left">Term B</th><th className="p-2 text-right">Shared docs</th></tr></thead>
              <tbody className="divide-y divide-panel-border/60">
                {report.cooccurrence.slice(0, 12).map((c) => (
                  <tr key={`${c.a}-${c.b}`}>
                    <td className="p-2 font-mono text-text-secondary">{c.a}</td>
                    <td className="p-2 font-mono text-text-secondary">{c.b}</td>
                    <td className="p-2 text-right font-mono text-cyan">{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Shared entities" eyebrow="Document references">
            <ul className="space-y-2">
              {report.sharedEntities.slice(0, 8).map((e) => (
                <li key={e.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-text-secondary">{e.name}</span>
                  <Badge tone="blue">{e.docs}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Common dates" eyebrow="Temporal references">
            <ul className="space-y-2">
              {report.commonDates.length === 0 && <li className="text-xs text-text-muted">No ISO dates detected.</li>}
              {report.commonDates.map((d) => (
                <li key={d.date} className="flex items-center justify-between font-mono text-xs">
                  <span className="text-text-secondary">{d.date}</span><span className="text-amber">{d.count}×</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="How this works" eyebrow="Methodology">
            <ul className="space-y-2 text-[0.7rem] leading-relaxed text-text-secondary">
              {Object.entries(report.explanations).map(([k, v]) => (
                <li key={k}><span className="text-cyan">{k.replace(/([A-Z])/g, " $1")}:</span> {v}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
