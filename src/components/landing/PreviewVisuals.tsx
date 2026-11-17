import { Activity, Database, Search } from "lucide-react";

/** Mock workstation shell — pure CSS, no images. */
export function EnvironmentPreview() {
  const nav = ["Overview", "Evidence Vault", "Analyzer", "Entities", "Graph", "Timeline"];
  return (
    <div className="gt-panel-elevated gt-glow mx-auto max-w-5xl overflow-hidden">
      <div className="flex items-center gap-2 border-b border-panel-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-critical/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="gt-label ml-3">ghosttrace://workspace/nightfall</span>
      </div>
      <div className="grid grid-cols-[150px_1fr_190px] max-sm:grid-cols-[110px_1fr]">
        <aside className="border-r border-panel-border p-3 max-sm:hidden">
          {["INTELLIGENCE", "ANALYSIS", "SYSTEM"].map((g) => (
            <div key={g} className="mb-4">
              <p className="gt-label mb-2">{g}</p>
              {nav.slice(0, 3).map((n) => (
                <p key={n} className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-panel-elevated">
                  {n}
                </p>
              ))}
            </div>
          ))}
        </aside>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {[["Evidence", "24", "bg-cyan"], ["Entities", "38", "bg-intel-blue"], ["Events", "52", "bg-violet"]].map(
            ([l, v, c]) => (
              <div key={l} className="rounded-lg border border-panel-border bg-panel p-3">
                <p className="gt-label">{l}</p>
                <p className="mt-1 font-mono text-lg text-text-primary">{v}</p>
                <div className={`mt-2 h-0.5 w-8 rounded-full ${c}`} />
              </div>
            ),
          )}
          <div className="col-span-full rounded-lg border border-panel-border bg-panel p-3">
            <svg viewBox="0 0 600 110" className="h-24 w-full" aria-hidden>
              {[
                [60, 55], [180, 30], [180, 80], [300, 55], [420, 25], [420, 85], [540, 55],
              ].map(([x, y], i, a) =>
                i < a.length - 1 ? (
                  <line key={`l${i}`} x1={x} y1={y} x2={a[i + 1][0]} y2={a[i + 1][1]} stroke="#1C2B3A" />
                ) : null,
              )}
              {[
                [60, 55], [180, 30], [180, 80], [300, 55], [420, 25], [420, 85], [540, 55],
              ].map(([x, y], i) => (
                <circle key={`c${i}`} cx={x} cy={y} r="4" fill={i === 3 ? "#00D5FF" : "#3478FF"} />
              ))}
            </svg>
          </div>
        </div>
        <aside className="hidden border-l border-panel-border p-3 sm:block">
          <p className="gt-label mb-2">Activity</p>
          {["Evidence indexed", "Entity identified", "Timeline updated", "Path resolved"].map((a) => (
            <p key={a} className="border-l border-cyan/40 pl-2 text-[0.65rem] text-text-secondary">
              {a}
            </p>
          ))}
        </aside>
      </div>
    </div>
  );
}

export function GraphPreview() {
  return (
    <div className="gt-panel gt-glow relative aspect-[4/3] overflow-hidden">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
        {[
          [200, 150, "#00D5FF", 7],
          [90, 80, "#3478FF", 5], [130, 220, "#3478FF", 4], [320, 90, "#8B78FF", 4],
          [300, 230, "#FFB547", 4], [60, 160, "#3478FF", 3], [250, 40, "#8B78FF", 3],
          [350, 170, "#3478FF", 3],
        ].map((t, i) => (
          <circle key={i} cx={t[0]} cy={t[1]} r={t[3]} fill={t[2] as string} />
        ))}
        {[
          [200, 150, 90, 80], [200, 150, 130, 220], [200, 150, 320, 90], [200, 150, 300, 230],
          [90, 80, 60, 160], [320, 90, 250, 40], [320, 90, 350, 170], [60, 160, 130, 220],
          [300, 230, 350, 170], [250, 40, 90, 80],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1C2B3A" strokeWidth="1" />
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2">
        {["Person", "Org", "Location", "Event"].map((t, i) => (
          <span key={t} className="gt-label rounded border border-panel-border bg-bg-primary/80 px-2 py-1">
            {["●", "●", "●", "●"][i]} {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TimelinePreview() {
  const events = [
    { d: "MAR 04", t: "Archive transfer logged", tone: "cyan" },
    { d: "MAR 09", t: "Meridian meeting record", tone: "blue" },
    { d: "MAR 17", t: "Funding approval memo", tone: "violet", unverified: true },
    { d: "APR 02", t: "Terminal access event", tone: "amber" },
  ];
  return (
    <div className="gt-panel relative overflow-hidden p-6">
      <div className="absolute left-6 right-6 top-16 h-px bg-panel-border" aria-hidden />
      <div className="relative grid grid-cols-4 gap-3">
        {events.map((e) => (
          <div key={e.t} className="text-center">
            <p className="gt-label">{e.d}</p>
            <div
              className={`mx-auto mt-3 h-3 w-3 rounded-full border-2 border-bg-primary ${
                { cyan: "bg-cyan", blue: "bg-intel-blue", violet: "bg-violet", amber: "bg-amber" }[e.tone]
              } ${e.unverified ? "opacity-40 ring-1 ring-amber/60" : ""}`}
            />
            <p className="mt-3 text-[0.7rem] leading-snug text-text-secondary">{e.t}</p>
            {e.unverified && <p className="gt-label mt-1 text-amber">unverified time</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocAnalysisPreview() {
  return (
    <div className="gt-panel space-y-2 p-6 font-mono text-[0.7rem] leading-relaxed">
      <p className="gt-label mb-3">analyzer://run-0741 · local rule-based</p>
      <p className="text-text-secondary">
        Memo <mark className="rounded bg-amber/20 px-1 text-amber">transmitted</mark> from{" "}
        <mark className="rounded bg-cyan/15 px-1 text-cyan">nightfall.dev@meridian-io.example</mark>{" "}
        regarding the <mark className="rounded bg-violet/15 px-1 text-violet">Archive</mark> review.
      </p>
      <p className="text-text-secondary">
        The <mark className="rounded bg-intel-blue/15 px-1 text-intel-blue">Meridian Group</mark>{" "}
        scheduled a <mark className="rounded bg-amber/20 px-1 text-amber">2024-03-17</mark>{" "}
        briefing; two attendees remain unidentified.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 pt-2">
        {[
          { icon: Database, l: "words", v: "412" },
          { icon: Search, l: "keywords", v: "18" },
          { icon: Activity, l: "trigrams", v: "96" },
        ].map((s) => (
          <div key={s.l} className="rounded border border-panel-border p-2 text-center">
            <s.icon className="mx-auto h-3.5 w-3.5 text-cyan" />
            <p className="mt-1 text-text-primary">{s.v}</p>
            <p className="gt-label">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
