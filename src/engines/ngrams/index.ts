import { contentWords } from "../tokenizer";

export interface NGram { gram: string; count: number }

/** Generate unigram, bigram, or trigram frequency lists. */
export function ngrams(text: string, size: 1 | 2 | 3 = 2): NGram[] {
  const words = contentWords(text, false);
  const counts = new Map<string, number>();
  for (let i = 0; i <= words.length - size; i++) {
    const gram = words.slice(i, i + size).join(" ");
    counts.set(gram, (counts.get(gram) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([gram, count]) => ({ gram, count }))
    .filter((g) => g.count > 1)
    .sort((a, b) => b.count - a.count || a.gram.localeCompare(b.gram));
}
