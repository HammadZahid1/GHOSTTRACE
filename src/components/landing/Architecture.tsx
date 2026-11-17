import { Cpu, Database, Eye, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/common";

const layers = [
  { n: "01", icon: Database, title: "Static scenario data", desc: "Coherent fictional datasets — investigations, entities, relationships, events, and evidence documents." },
  { n: "02", icon: Cpu, title: "Local analysis engines", desc: "Deterministic TypeScript engines: tokenizer, frequency, n-grams, similarity, graph traversal, pattern detection." },
  { n: "03", icon: Eye, title: "Visualization layer", desc: "React Three Fiber for 3D intelligence networks, Recharts for analytical charts, Framer Motion for interface motion." },
  { n: "04", icon: ShieldCheck, title: "Browser-only persistence", desc: "Preferences and workspace state in localStorage with export/import — no servers, no accounts, no telemetry." },
];

export function Architecture() {
  return (
    <section id="architecture" className="border-b border-panel-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Technical Architecture"
          title="Four layers, zero backend"
          description="Everything GHOSTTRACE does — parsing, analysis, graph layout, rendering — happens in the browser sandbox."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {layers.map((l) => (
            <div key={l.n} className="gt-panel relative p-5">
              <span className="absolute right-4 top-4 font-mono text-xs text-text-muted">{l.n}</span>
              <l.icon className="h-5 w-5 text-cyan" />
              <h3 className="mt-4 font-display text-sm font-medium text-text-primary">{l.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
