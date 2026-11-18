"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Database, Eye, HardDrive, Timer } from "lucide-react";
import { Badge, Panel, StatCard } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { useAnalysisStore } from "@/stores/analysis-store";
import { useEvidenceStore } from "@/stores/evidence-store";

export default function MonitorPage() {
  const [ticks, setTicks] = useState(0);
  const history = useAnalysisStore((s) => s.history);
  const evidence = useEvidenceStore((s) => s.items);
  const [mem, setMem] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setTicks((t) => t + 1), 1000);
    const timeout = window.setTimeout(() => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      if (perf.memory) setMem(Math.round(perf.memory.usedJSHeapSize / 1048576));
    }, 0);
    return () => { window.clearInterval(id); window.clearTimeout(timeout); };
  }, []);

  // Simulated metrics explicitly labeled; browser does not expose real CPU/GPU usage.
  const load = 12 + Math.round((Math.sin(ticks / 4) + 1) * 16);
  const renderMs = 8 + Math.round((Math.cos(ticks / 5) + 1) * 5);
  const uptime = `${String(Math.floor(ticks / 60)).padStart(2, "0")}:${String(ticks % 60).padStart(2, "0")}`;

  return (
    <>
      <ModuleHeader eyebrow="System / Monitor" title="System Monitor"
        description="Browser-side activity and simulated processing metrics — no operating system telemetry."
        actions={<Badge tone="amber" dot>Simulated metrics</Badge>} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Session uptime" value={uptime} tone="cyan" hint="mm:ss" />
        <StatCard label="Processing load" value={`${load}%`} tone="amber" hint="simulated" />
        <StatCard label="Graph rendering" value={`${renderMs} ms`} tone="violet" hint="simulated frame estimate" />
        <StatCard label="Indexed evidence" value={evidence.length} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Local processing activity" eyebrow="Live (simulated)" contentClassName="space-y-4">
          {[
            { label: "Document analysis queue", value: Math.min(100, 20 + (ticks * 7) % 80), color: "#00D5FF" },
            { label: "Graph layout engine", value: Math.min(100, 35 + (ticks * 3) % 60), color: "#3478FF" },
            { label: "Visualization pipeline", value: Math.min(100, 45 + (ticks * 5) % 50), color: "#8B78FF" },
          ].map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-xs"><span className="text-text-secondary">{b.label}</span><span className="font-mono text-text-muted">{b.value}%</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-panel-border">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${b.value}%`, background: b.color }} />
              </div>
            </div>
          ))}
          <p className="text-[0.7rem] leading-relaxed text-text-muted">
            Bars are illustrative simulations. GHOSTTRACE does not access operating-system CPU or GPU counters.
          </p>
        </Panel>

        <Panel title="Active visualizations" eyebrow="Runtime">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Activity, l: "Intelligence graph", v: "R3F / WebGL" },
              { icon: Eye, l: "Pattern charts", v: "Recharts / SVG" },
              { icon: Database, l: "Analysis engine", v: "TypeScript" },
              { icon: HardDrive, l: "Storage", v: "localStorage" },
            ].map((v) => (
              <div key={v.l} className="rounded-lg border border-panel-border p-3">
                <v.icon className="h-4 w-4 text-cyan" />
                <p className="mt-2 text-xs text-text-primary">{v.l}</p>
                <p className="gt-label mt-1">{v.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded border border-panel-border p-2 text-xs">
            <Timer className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-text-secondary">JS heap estimate</span>
            <span className="ml-auto font-mono text-cyan">{mem === null ? "unavailable" : `${mem} MB`}</span>
          </div>
          {mem === null && <p className="mt-1 text-[0.65rem] text-text-muted">Browser does not expose heap measurements.</p>}
        </Panel>

        <Panel title="Processing history" eyebrow="Analysis store">
          {history.length === 0 ? <p className="text-xs text-text-muted">No analyses recorded in this session.</p> : (
            <ul className="space-y-1.5">
              {history.slice(0, 10).map((h) => (
                <li key={h.id} className="flex justify-between rounded border border-panel-border px-2 py-1.5 font-mono text-[0.7rem]">
                  <span className="text-text-secondary">{h.id}</span>
                  <span className="text-cyan">{h.words} words / {h.keywords} keywords</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Event log" eyebrow="Session">
          <ul className="space-y-2 font-mono text-[0.7rem] text-text-secondary">
            <li>[00:00] local workspace initialized</li>
            <li>[00:01] {evidence.length} evidence items indexed</li>
            <li>[00:02] deterministic engines ready</li>
            <li>[00:03] visualization pipeline online</li>
            <li>[{uptime}] monitor refresh · simulated metrics</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
