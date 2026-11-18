import { contentWords } from "../tokenizer";

export interface TermFrequency { term: string; count: number }

export function wordFrequency(text: string, ignoreStopWords = true): TermFrequency[] {
  const counts = new Map<string, number>();
  for (const w of contentWords(text, ignoreStopWords)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
}

/** Keyword extraction: frequency ranking with stop-word filtering. */
export function extractKeywords(text: string, limit = 20, ignoreStopWords = true): TermFrequency[] {
  return wordFrequency(text, ignoreStopWords).slice(0, limit);
}
