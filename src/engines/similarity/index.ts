import { contentWords } from "../tokenizer";

/** Jaccard similarity over token sets — deterministic, explainable. */
export function jaccard(a: string, b: string): number {
  const A = new Set(contentWords(a, false));
  const B = new Set(contentWords(b, false));
  if (A.size + B.size === 0) return 0;
  const intersection = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return Math.round((intersection / union) * 1000) / 1000;
}

/** Cosine similarity over frequency vectors. */
export function cosine(a: string, b: string): number {
  const vec = (t: string) => {
    const m = new Map<string, number>();
    for (const w of contentWords(t, false)) m.set(w, (m.get(w) ?? 0) + 1);
    return m;
  };
  const A = vec(a), B = vec(b);
  let dot = 0, na = 0, nb = 0;
  for (const [k, v] of A) { dot += v * (B.get(k) ?? 0); na += v * v; }
  for (const v of B.values()) nb += v * v;
  return na && nb ? Math.round((dot / (Math.sqrt(na) * Math.sqrt(nb))) * 1000) / 1000 : 0;
}
