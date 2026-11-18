import { ENTITIES } from "@/data/scenarios";

export interface CandidatePattern {
  kind: "email" | "date" | "organization" | "known_entity";
  value: string;
  index: number;
  method: string;
}

/** Explainable pattern matching — not named-entity recognition or AI inference. */
export function extractCandidates(text: string): CandidatePattern[] {
  const out: CandidatePattern[] = [];
  const email = /\b[\w.'-]+@[\w-]+\.[a-z]{2,}\b/gi;
  const date = /\b(?:19|20)\d{2}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\/(?:19|20)?\d{2}\b/g;
  const org = /\b[A-Z][\w&'-]*(?:\s+[A-Z][\w&'-]*){0,3}\s+(?:Group|Institute|Systems|Corp|Agency|Archive)\b/g;

  for (const [kind, re, method] of [
    ["email", email, "email-like regex"],
    ["date", date, "date-like regex"],
    ["organization", org, "capitalized phrase + organization suffix"],
  ] as const) {
    for (const m of text.matchAll(re)) {
      out.push({ kind, value: m[0], index: m.index ?? 0, method });
    }
  }

  const lower = text.toLowerCase();
  for (const e of ENTITIES) {
    const index = lower.indexOf(e.name.toLowerCase());
    if (index >= 0) out.push({ kind: "known_entity", value: e.name, index, method: "explicit fictional dataset lookup" });
  }
  return out.sort((a, b) => a.index - b.index);
}
