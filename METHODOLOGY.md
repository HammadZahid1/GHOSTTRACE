# Methodology

GHOSTTRACE uses **deterministic, auditable local algorithms**. It does **not** use an LLM, external model, or AI inference service. Nothing described below should be interpreted as machine learning or real-world intelligence gathering.

## Tokenization

`tokenize()` uses a Unicode-aware regular expression to split text into word tokens. `contentWords()` lowercases tokens and may remove a built-in stop-word list. This is a simple lexical operation.

## Frequency analysis

Term frequency counts occurrences of each token after optional stop-word removal; results are sorted by count then alphabetically. Keyword extraction is frequency ranking with a configurable limit — not semantic importance.

## N-gram analysis

Unigrams, bigrams, and trigrams are contiguous token windows. Only sequences appearing more than once are returned, sorted by frequency.

## Document statistics

Word, unique-word, sentence, paragraph, and character counts are derived by regular-expression splitting. Average sentence length is words ÷ sentences, rounded to one decimal.

## Candidate entity extraction

Email-like strings, ISO/US date-like expressions, and capitalized organization-like phrases are found with explicit regular expressions. Known fictional entity names are matched via a dataset lookup. These are **candidate patterns**, not perfect named-entity recognition.

## Similarity

Jaccard similarity is the intersection over union of token sets. Cosine similarity uses frequency vectors. Both are bounded deterministic metrics.

## Graph traversal

A seeded force-directed layout places nodes using pairwise repulsion and spring attraction for a fixed number of iterations. Breadth-first search explores neighbors layer by layer; `shortestPath()` reconstructs the minimum-hop path and its relationships. Degree centrality counts direct edges.

## Timeline reconstruction

Events are sorted by ISO date with undated events always last. Missing timestamps are never invented — they remain explicitly "unverified time". Filtering by query, category, and date range is exact matching. Reordering swaps assigned timestamps between adjacent events.

## Pattern detection

Counts are computed over the selected dataset: repeated terms, entity-name occurrences in documents, regex-matched dates, event categories, relationship types, keyword co-occurrence within documents, and events grouped by month. Co-occurrence is a **shared occurrence**, not a relationship between people.

## Confidence interpretation

Entity confidence values describe the reliability of the **extraction method** (explicit dataset entries score 0.95; manual entries score 1.0). They are **not** probabilities that any person committed an action, and no guilt or real-world identity claim is made anywhere.

## Deterministic algorithms vs AI inference

Deterministic algorithms produce the same output for the same input by fixed rules. AI inference (LLM or otherwise) learns statistical patterns from data and produces variable outputs. GHOSTTRACE exclusively implements the former; all “analysis” labels refer to local rule-based computation.
