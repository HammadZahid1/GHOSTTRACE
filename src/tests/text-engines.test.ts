import { describe, expect, it } from "vitest";
import { tokenize, contentWords, STOP_WORDS } from "@/engines/tokenizer";
import { wordFrequency, extractKeywords } from "@/engines/frequency";
import { ngrams } from "@/engines/ngrams";
import { documentStats } from "@/engines/statistics";
import { cosine, jaccard } from "@/engines/similarity";

const text = "The nightfall memo mentioned Meridian. The memo moved the nightfall archive. Meridian reviewed the memo again.";

describe("text engines", () => {
  it("tokenizes words and punctuation", () => {
    expect(tokenize("Hello, world!").length).toBeGreaterThanOrEqual(2);
    expect(contentWords("The memo", true)).toEqual(["memo"]);
    expect(STOP_WORDS.has("the")).toBe(true);
  });

  it("ranks word frequency and extracts keywords", () => {
    const freq = wordFrequency(text);
    expect(freq[0].term).toBe("memo");
    expect(freq[0].count).toBe(3);
    expect(extractKeywords(text, 3)).toHaveLength(3);
    expect(wordFrequency(text, false).some((t) => t.term === "the")).toBe(true);
  });

  it("generates n-grams", () => {
    expect(ngrams(text, 1)[0].gram).toBe("the");
    expect(ngrams(text, 2).some((g) => g.gram === "the memo")).toBe(true);
    expect(ngrams(text, 3).every((g) => g.gram.split(" ").length === 3)).toBe(true);
  });

  it("calculates document statistics", () => {
    const s = documentStats("One. Two words here.\n\nThird paragraph.");
    expect(s.words).toBe(6);
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
    expect(s.averageSentenceLength).toBe(2);
    expect(s.characters).toBeGreaterThan(0);
  });

  it("computes deterministic similarity", () => {
    expect(jaccard("alpha beta", "alpha beta")).toBe(1);
    expect(jaccard("alpha", "beta")).toBe(0);
    expect(cosine("alpha alpha beta", "alpha beta")).toBeGreaterThan(0.8);
  });
});
