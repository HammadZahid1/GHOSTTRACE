import { SectionHeader } from "@/components/common";
import {
  EnvironmentPreview,
  GraphPreview,
  TimelinePreview,
  DocAnalysisPreview,
} from "./PreviewVisuals";

export function Environment() {
  return (
    <section className="border-b border-panel-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Investigation Environment"
          title="Every module, one command center"
          description="Navigate between evidence, entities, timelines, and patterns from a single workspace shell with a global command palette."
        />
        <div className="mt-14">
          <EnvironmentPreview />
        </div>
      </div>
    </section>
  );
}

export function GraphSection() {
  return (
    <section className="border-b border-panel-border/60 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <GraphPreview />
        <div>
          <SectionHeader
            align="left"
            eyebrow="Relationship Mapping"
            title="Connections rendered as living structure"
            description="Force-directed layouts position entities by relationship density. Select any two nodes and a breadth-first search reveals the shortest evidential path between them."
          />
          <ul className="mt-8 space-y-3 text-sm text-text-secondary">
            {[
              "Six entity categories with distinct visual signatures",
              "Deterministic layouts — sample scenarios render identically every time",
              "2D / 3D view switching with typed relationship filtering",
              "BFS path reconstruction between selected entities",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function TimelineSection() {
  return (
    <section className="border-b border-panel-border/60 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <SectionHeader
            align="left"
            eyebrow="Temporal Analysis"
            title="Chronology with honest uncertainty"
            description="Reconstruct event sequences while keeping missing or ambiguous timestamps visibly unverified — the system never invents precision."
          />
          <ul className="mt-8 space-y-3 text-sm text-text-secondary">
            {[
              "Horizontal and vertical chronology modes with zoom",
              "Explicit “unverified time” state for ambiguous events",
              "Per-event evidence references and review status",
              "Full export for reporting workflows",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="order-1 lg:order-2">
          <TimelinePreview />
        </div>
      </div>
    </section>
  );
}

export function DocSection() {
  return (
    <section className="border-b border-panel-border/60 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <DocAnalysisPreview />
        <div>
          <SectionHeader
            align="left"
            eyebrow="Text Intelligence"
            title="Local rule-based document analysis"
            description="Tokenization, frequency ranking, n-gram generation, and pattern extraction — deterministic, explainable, and fully offline."
          />
          <ul className="mt-8 space-y-3 text-sm text-text-secondary">
            {[
              "Selectable keyword highlighting in source text",
              "Unigram / bigram / trigram ranking with stop-word control",
              "Email, date, and organization-like pattern detection",
              "JSON and text export of every analysis run",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
