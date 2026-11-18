"use client";

import { useMemo, useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { Badge, Button, Panel, StatCard } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { EVIDENCE } from "@/data/scenarios";

import { extractKeywords, wordFrequency } from "@/engines/frequency";
import { ngrams } from "@/engines/ngrams";
import { documentStats } from "@/engines/statistics";
import { extractCandidates } from "@/engines/patterns";
import { jaccard } from "@/engines/similarity";
import { useAnalysisStore } from "@/stores/analysis-store";


type Result = {
  text: string;
  stats: ReturnType<typeof documentStats>;
  keywords: ReturnType<typeof extractKeywords>;
  freq: ReturnType<typeof wordFrequency>;
  uni: ReturnType<typeof ngrams>;
  bi: ReturnType<typeof ngrams>;
  tri: ReturnType<typeof ngrams>;
  candidates: ReturnType<typeof extractCandidates>;
  steps: string[];
};

export default function AnalyzerPage() {
  const [text, setText] = useState(EVIDENCE[0].content);
  const [result, setResult] = useState<Result | null>(null);
  const [highlight, setHighlight] = useState<string[]>([]);
  const [tab, setTab] = useState<"keywords" | "unigrams" | "bigrams" | "trigrams" | "patterns">("keywords");
  const [keepStopWords, setKeepStopWords] = useState(false);
  const [topN, setTopN] = useState(20);
  const addToHistory = useAnalysisStore((s) => s.add);
  const history = useAnalysisStore((s) => s.history);

  const run = () => {
    const steps = [
      "1 · tokenize input into word tokens",
      "2 · filter configurable stop words",
      "3 · rank terms by frequency",
      "4 · generate unigram / bigram / trigram counts",
      "5 · apply explainable regex + dataset lookups",
    ];
    const r: Result = {
      text,
      stats: documentStats(text),
      keywords: extractKeywords(text, topN, !keepStopWords),
      freq: wordFrequency(text, !keepStopWords),
      uni: ngrams(text, 1), bi: ngrams(text, 2), tri: ngrams(text, 3),
      candidates: extractCandidates(text),
      steps,
    };
    setResult(r);
    addToHistory({ id: `AN-${Date.now()}`, at: new Date().toISOString(), words: r.stats.words, keywords: r.keywords.length });
  };

  const exportResult = (format: "json" | "txt") => {
    if (!result) return;
    const data = format === "json"
      ? JSON.stringify(result, null, 2)
      : `GHOSTTRACE LOCAL ANALYSIS\n${result.steps.join("\n")}\n\nSTATS\n${JSON.stringify(result.stats)}\n\nKEYWORDS\n${result.keywords.map((k) => `${k.term}: ${k.count}`).join("\n")}`;
    const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ghosttrace-analysis.${format}`; a.click();
    URL.revokeObjectURL(url);
  };

  const highlighted = useMemo(() => {
    if (!highlight.length || !result) return result?.text ?? text;
    const parts = result.text.split(/(\s+)/);
    return parts.map((p) =>
      highlight.some((h) => p.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "") === h.toLowerCase())
        ? `\u001b${p}\u001c` : p,
    ).join("");
  }, [highlight, result, text]);

  const rows = tab === "keywords" ? result?.keywords.map((k) => [k.term, k.count])
    : tab === "unigrams" ? result?.uni.map((k) => [k.gram, k.count])
      : tab === "bigrams" ? result?.bi.map((k) => [k.gram, k.count])
        : tab === "trigrams" ? result?.tri.map((k) => [k.gram, k.count])
          : result?.candidates.map((c) => [c.kind, c.value]);

  return (
    <>
      <ModuleHeader
        eyebrow="Intelligence / Document Analyzer"
        title="Document Analyzer"
        description="Deterministic, explainable text analysis performed entirely in your browser."
        actions={<Badge tone="amber" dot>Local rule-based text analysis</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="Source text" eyebrow="Input" actions={
          <div className="flex flex-wrap gap-2">
            <select onChange={(e) => { const d = EVIDENCE.find((x) => x.id === e.target.value); if (d) setText(d.content); }}
              className="h-8 max-w-40 rounded-lg border border-panel-border bg-panel px-2 text-xs text-text-secondary">
              <option value="">Sample document…</option>
              {EVIDENCE.slice(0, 8).map((d) => <option key={d.id} value={d.id}>{d.filename}</option>)}
            </select>
            <label className="flex h-8 cursor-pointer items-center rounded-lg border border-panel-border px-2 text-xs text-text-secondary hover:border-cyan/40">
              Import .txt
              <input type="file" accept=".txt" className="hidden" onChange={async (e) => {
                const f = e.target.files?.[0]; if (f) setText(await f.text());
              }} />
            </label>
            <label className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-panel-border px-2 text-xs text-text-secondary">
              <input type="checkbox" checked={keepStopWords} onChange={(e) => setKeepStopWords(e.target.checked)} />
              Keep stop words
            </label>
            <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}
              className="h-8 rounded-lg border border-panel-border bg-panel px-2 text-xs text-text-secondary">
              {[10, 20, 40, 80].map((n) => <option key={n} value={n}>Top {n}</option>)}
            </select>
            <Button size="sm" variant="primary" icon={<Play className="h-3.5 w-3.5" />} onClick={run}>Run analysis</Button>
          </div>
        }>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16}
            className="w-full resize-y rounded-lg border border-panel-border bg-bg-primary p-3 font-mono text-xs leading-relaxed text-text-secondary outline-none focus:border-cyan/50"
            aria-label="Source text to analyze" />
          {result && (
            <div className="mt-3 rounded-lg border border-panel-border bg-bg-secondary/50 p-3">
              <p className="gt-label mb-2">Source with selected keyword highlighted (marker: «term»)</p>
              <p className="max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-[0.7rem] text-text-secondary">
                {highlighted.replace(/\u001b/g, "«").replace(/\u001c/g, "»")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.keywords.slice(0, 12).map((k) => (
                  <button key={k.term} onClick={() => setHighlight((h) => h.includes(k.term) ? h.filter((x) => x !== k.term) : [...h, k.term])}
                    className={`rounded border px-2 py-0.5 font-mono text-[0.65rem] ${highlight.includes(k.term) ? "border-cyan bg-cyan/10 text-cyan" : "border-panel-border text-text-muted"}`}>
                    {k.term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Panel>

        <div className="space-y-4">
          {!result ? (
            <Panel title="Analysis output" eyebrow="Results">
              <div className="py-12 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-cyan/60" />
                <p className="mt-3 text-sm text-text-secondary">Run the local engine to see results.</p>
                <p className="gt-label mt-1">No external inference is performed</p>
              </div>
            </Panel>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                <StatCard label="Words" value={result.stats.words} tone="cyan" />
                <StatCard label="Unique" value={result.stats.uniqueWords} />
                <StatCard label="Sentences" value={result.stats.sentences} />
                <StatCard label="Avg length" value={result.stats.averageSentenceLength} />
                <StatCard label="Paragraphs" value={result.stats.paragraphs} />
                <StatCard label="Patterns" value={result.candidates.length} tone="amber" />
              </div>
              <Panel title="Extracted terms" eyebrow="Results" actions={
                <div className="flex gap-2">
                  <button onClick={() => exportResult("json")} className="gt-label hover:text-cyan">JSON</button>
                  <button onClick={() => exportResult("txt")} className="gt-label hover:text-cyan">TXT</button>
                </div>
              }>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {(["keywords", "unigrams", "bigrams", "trigrams", "patterns"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`rounded border px-2.5 py-1 font-mono text-[0.65rem] ${tab === t ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-panel-border text-text-muted"}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <ul className="max-h-60 divide-y divide-panel-border/60 overflow-auto">
                  {rows?.slice(0, 40).map(([k, v], i) => (
                    <li key={`${k}-${i}`} className="flex items-center justify-between py-1.5 text-xs">
                      <span className="font-mono text-text-secondary">{k}</span>
                      <span className="font-mono text-cyan">{v}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Processing steps" eyebrow="Transparency">
                <ol className="space-y-1 font-mono text-[0.7rem] text-text-secondary">
                  {result.steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
                <p className="mt-3 text-[0.7rem] leading-relaxed text-text-muted">
                  Candidate patterns are regex / dataset matches, not perfect named-entity recognition.
                  {jaccard(result.text, EVIDENCE[1].content) > 0 && " Similarity metrics are deterministic set overlaps."}
                </p>
              </Panel>
            </>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <Panel className="mt-4" title="Analysis history" eyebrow="Local session">
          <ul className="flex flex-wrap gap-2">
            {history.slice(0, 12).map((h) => (
              <li key={h.id} className="rounded border border-panel-border px-2 py-1 font-mono text-[0.65rem] text-text-muted">
                {h.id} · {h.words} words · {h.keywords} keywords
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}





