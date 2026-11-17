import {
  Boxes, FileSearch, GitBranch, ScanText, Share2, Waypoints,
} from "lucide-react";
import { Badge, SectionHeader } from "@/components/common";

const capabilities = [
  {
    icon: ScanText,
    title: "Document Analyzer",
    tone: "cyan" as const,
    desc: "Local rule-based tokenization, keyword extraction, n-gram analysis, and entity-like pattern detection on any pasted or imported text.",
  },
  {
    icon: Share2,
    title: "Entity Intelligence",
    tone: "blue" as const,
    desc: "Explore fictional individuals, organizations, locations, and projects with evidence references and explainable extraction confidence.",
  },
  {
    icon: Waypoints,
    title: "Connection Graph",
    tone: "violet" as const,
    desc: "An interactive 3D force-directed intelligence network with BFS shortest-path reconstruction between any two entities.",
  },
  {
    icon: GitBranch,
    title: "Timeline Reconstruction",
    tone: "amber" as const,
    desc: "Chronological event workspaces with explicit unverified-time states — no invented precision for ambiguous evidence.",
  },
  {
    icon: Boxes,
    title: "Pattern Observatory",
    tone: "critical" as const,
    desc: "Frequency, co-occurrence, and temporal cluster analytics with visible methodology and correlation ≠ causation labeling.",
  },
  {
    icon: FileSearch,
    title: "Evidence Vault",
    tone: "success" as const,
    desc: "Drag-and-drop local evidence management for TXT, CSV, JSON, and Markdown — processed entirely on-device.",
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="border-b border-panel-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Capabilities"
          title="A complete investigative toolchain"
          description="Ten interconnected analysis modules built on deterministic, explainable local algorithms — every calculation runs in your browser."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <article
              key={c.title}
              className="gt-panel group p-5 transition-colors duration-200 hover:border-cyan/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-panel-border bg-panel-elevated text-cyan">
                  <c.icon className="h-5 w-5" />
                </div>
                <Badge tone={c.tone}>{c.tone}</Badge>
              </div>
              <h3 className="mt-4 font-display text-base font-medium text-text-primary">
                {c.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
