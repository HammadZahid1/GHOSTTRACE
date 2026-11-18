import type { EvidenceDocument, Relationship, TimelineEvent } from "@/types";
import { contentWords } from "../tokenizer";
import { wordFrequency } from "../frequency";

export interface PatternReport {
  repeatedTerms: Array<{ term: string; count: number }>;
  sharedEntities: Array<{ name: string; docs: number }>;
  commonDates: Array<{ date: string; count: number }>;
  eventFrequency: Array<{ key: string; count: number }>;
  relationshipFrequency: Array<{ key: string; count: number }>;
  cooccurrence: Array<{ a: string; b: string; count: number }>;
  temporalClusters: Array<{ month: string; count: number }>;
  explanations: Record<string, string>;
}

/** All calculations are deterministic counts over the selected dataset. */
export function detectPatterns(
  docs: EvidenceDocument[],
  entities: Array<{ name: string }>,
  events: TimelineEvent[],
  relationships: Relationship[],
): PatternReport {
  const terms = wordFrequency(docs.map((d) => d.content).join("\n"), true).slice(0, 15);

  const sharedEntities = entities
    .map((e) => ({
      name: e.name,
      docs: docs.filter((d) => d.content.toLowerCase().includes(e.name.toLowerCase())).length,
    }))
    .filter((e) => e.docs > 0)
    .sort((a, b) => b.docs - a.docs)
    .slice(0, 12);

  const dateCounter = new Map<string, number>();
  for (const d of docs) for (const m of d.content.matchAll(/\b(?:19|20)\d{2}-\d{2}-\d{2}\b/g)) {
    dateCounter.set(m[0], (dateCounter.get(m[0]) ?? 0) + 1);
  }
  const commonDates = [...dateCounter.entries()].map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count).slice(0, 10);

  const eventFrequency = Object.entries(
    events.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] ?? 0) + 1; return acc; }, {}),
  ).map(([key, count]) => ({ key, count }));

  const relationshipFrequency = Object.entries(
    relationships.reduce<Record<string, number>>((acc, r) => { acc[r.type] = (acc[r.type] ?? 0) + 1; return acc; }, {}),
  ).map(([key, count]) => ({ key, count }));

  // Co-occurrence: top keyword pairs appearing in the same document.
  const top = terms.slice(0, 8).map((t) => t.term);
  const cooccurrence: Array<{ a: string; b: string; count: number }> = [];
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      const count = docs.filter((d) => {
        const w = new Set(contentWords(d.content, false));
        return w.has(top[i]) && w.has(top[j]);
      }).length;
      if (count > 0) cooccurrence.push({ a: top[i], b: top[j], count });
    }
  }
  cooccurrence.sort((a, b) => b.count - a.count);

  const monthCounter = new Map<string, number>();
  for (const e of events) if (e.date) {
    const m = e.date.slice(0, 7);
    monthCounter.set(m, (monthCounter.get(m) ?? 0) + 1);
  }
  const temporalClusters = [...monthCounter.entries()].map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    repeatedTerms: terms, sharedEntities, commonDates, eventFrequency,
    relationshipFrequency, cooccurrence, temporalClusters,
    explanations: {
      repeatedTerms: "Frequency-ranked content words after stop-word filtering.",
      sharedEntities: "Count of documents whose text contains each fictional entity name.",
      commonDates: "Regex-matched ISO dates counted across documents.",
      eventFrequency: "Count of events grouped by assigned category.",
      relationshipFrequency: "Count of relationships grouped by declared type.",
      cooccurrence: "Number of documents containing both of two top keywords.",
      temporalClusters: "Events grouped by the month prefix of their assigned date; undated events excluded.",
    },
  };
}
