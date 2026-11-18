import { tokenize } from "../tokenizer";

export interface DocumentStats {
  words: number;
  uniqueWords: number;
  sentences: number;
  averageSentenceLength: number;
  paragraphs: number;
  characters: number;
}

export function documentStats(text: string): DocumentStats {
  const words = tokenize(text);
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length;
  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;
  return {
    words: words.length,
    uniqueWords,
    sentences,
    averageSentenceLength: sentences ? Math.round((words.length / sentences) * 10) / 10 : 0,
    paragraphs,
    characters: text.length,
  };
}
