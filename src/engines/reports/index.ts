import type { Scenario } from "@/types";
import { detectPatterns } from "../pattern-detection";

export interface ReportSection {
  key: string;
  title: string;
  body: string;
  kind: "source" | "detected" | "hypothesis" | "method";
}

export interface InvestigationReport {
  title: string;
  investigationId: string;
  generatedAt: string;
  sections: ReportSection[];
  limitations: string[];
}

export const SECTION_OPTIONS = [
  { key: "overview", title: "Overview", kind: "source" },
  { key: "evidence", title: "Evidence inventory", kind: "source" },
  { key: "entities", title: "Identified entities", kind: "source" },
  { key: "relationships", title: "Relationships", kind: "detected" },
  { key: "events", title: "Chronological events", kind: "source" },
  { key: "patterns", title: "Observed patterns", kind: "detected" },
  { key: "unverified", title: "Unverified observations", kind: "hypothesis" },
  { key: "limitations", title: "Analytical limitations", kind: "method" },
  { key: "methodology", title: "Methodology", kind: "method" },
  { key: "conclusion", title: "Conclusion", kind: "method" },
] as const;

export function buildReport(
  scenario: Scenario,
  title: string,
  included: string[],
  notes = "",
): InvestigationReport {
  const { investigation: inv, evidence, entities, relationships, events } = scenario;
  const patterns = detectPatterns(evidence, entities, events, relationships);
  const body: Record<string, string> = {
    overview: `${inv.description} This report summarizes fictional data contained in local sample datasets.`,
    evidence: evidence.map((d) => `- ${d.filename} (${d.type}, ${d.wordCount} words, ${d.category})`).join("\n"),
    entities: entities.map((e) => `- ${e.name} [${e.category}] — ${e.description}`).join("\n"),
    relationships: relationships.map((r) => {
      const a = entities.find((e) => e.id === r.source)?.name ?? r.source;
      const b = entities.find((e) => e.id === r.target)?.name ?? r.target;
      return `- ${a} — [${r.type}] — ${b} (${r.label})`;
    }).join("\n"),
    events: events.filter((e) => e.date).sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
      .map((e) => `- ${e.date}: ${e.title} [${e.status}]`).join("\n"),
    patterns: `- Top repeated terms: ${patterns.repeatedTerms.slice(0, 8).map((t) => `${t.term} (${t.count})`).join(", ")}\n- Temporal clusters: ${patterns.temporalClusters.map((c) => `${c.month}: ${c.count}`).join(", ")}\n- These are counts, not verified facts. Correlation does not imply causation.`,
    unverified: events.filter((e) => !e.date).map((e) => `- ${e.title}: undated (no precise timestamp assigned)`).join("\n")
      + (notes ? `\n\nUser-added notes (unverified hypotheses):\n${notes}` : ""),
    limitations: "- All evidence is fictional illustrative data.\n- Rule-based extraction may miss or misclassify patterns.\n- Detected relationships are dataset declarations, not proof of conduct.\n- No external model or inference service was used.",
    methodology: "Deterministic local algorithms: tokenization, stop-word-filtered frequency ranking, n-gram counts, regex candidate extraction, force-directed layout, breadth-first graph traversal, and chronological sorting. No LLM or external AI inference is used.",
    conclusion: `This report presents source-backed observations, algorithmically detected patterns, and explicitly unverified material for ${inv.title}. No claim of real-world identity, guilt, or causation is made.`,
  };
  return {
    title, investigationId: inv.id, generatedAt: new Date().toISOString(),
    sections: SECTION_OPTIONS.filter((s) => included.includes(s.key)).map((s) => ({
      key: s.key, title: s.title, body: body[s.key] ?? "", kind: s.kind,
    })),
    limitations: ["Fictional data only", "No external verification", "Patterns are not proof of causation"],
  };
}

export function reportToMarkdown(report: InvestigationReport): string {
  const heading = `# ${report.title}\n\n**Investigation ID:** ${report.investigationId}  \n**Generated:** ${report.generatedAt}\n\n> Educational demonstration. All evidence is fictional. Patterns are not verified facts.\n`;
  return heading + report.sections.map((s) =>
    `\n## ${s.title}\n\n*Classification: ${s.kind === "source" ? "source-backed observation" : s.kind === "detected" ? "algorithmically detected pattern" : s.kind === "hypothesis" ? "unverified / user-added" : "method"}*\n\n${s.body}`,
  ).join("\n\n---\n");
}
