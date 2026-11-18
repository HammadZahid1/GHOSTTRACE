/** Simple deterministic tokenizer. */
export function tokenize(text: string): string[] {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}'_-]*/gu) ?? [];
}

export const STOP_WORDS = new Set(
  `a an the and or but if then than of to in on at by for with from as is are was were be been being this that these those it its into about over under between during before after above below up down out off again further here there when where why how all any both each few more most other some such no nor not only own same so too very can will just should now also may might must shall would could did does doing have has had having he she they them his her their we our you your i me my they're don't`.split(/\s+/),
);

export function contentWords(text: string, removeStopWords = true): string[] {
  return tokenize(text)
    .map((w) => w.toLowerCase())
    .filter((w) => !removeStopWords || !STOP_WORDS.has(w));
}
