import Link from "next/link";
import { ArrowUpRight, FileText, GitBranch, Users, Archive, Clock3, Eye } from "lucide-react";
import { Badge, Panel, StatCard } from "@/components/common";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import { EVIDENCE, EVENTS, INVESTIGATIONS, RELATIONSHIPS, ENTITIES } from "@/data/scenarios";

const activity = [
  { icon: FileText, text: "Evidence indexed", ref: "nightfall-d04.txt", tone: "cyan" as const, time: "2m" },
  { icon: Users, text: "New entity identified", ref: "Mira Solano", tone: "blue" as const, time: "18m" },
  { icon: Clock3, text: "Timeline updated", ref: "ev13 · archive reconciliation", tone: "amber" as const, time: "1h" },
  { icon: GitBranch, text: "Relationship discovered", ref: "r10 · funded", tone: "violet" as const, time: "3h" },
  { icon: Archive, text: "Report generated", ref: "INV-001 summary", tone: "success" as const, time: "5h" },
];

function NetworkPreview() {
  const nodes = [
    [330, 180, 10, "#00D5FF"], [210, 90, 6, "#3478FF"], [220, 260, 7, "#3478FF"],
    [460, 100, 7, "#8B78FF"], [470, 270, 6, "#FFB547"], [110, 180, 5, "#3478FF"],
    [340, 55, 5, "#8B78FF"], [560, 190, 5, "#3478FF"], [140, 70, 4, "#00D5FF"],
    [150, 300, 4, "#00D5FF"], [400, 320, 4, "#FFB547"],
  ] as const;
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [2, 8], [2, 9],
    [3, 7], [4, 7], [4, 10], [5, 8], [6, 3], [9, 2],
  ];
  return (
    <Panel
      title="Intelligence network preview"
      eyebrow="Live visualization"
      actions={<Link href="/graph" className="gt-label flex items-center gap-1 hover:text-cyan">Open graph <ArrowUpRight className="h-3 w-3" /></Link>}
      contentClassName="p-0"
    >
      <div className="bg-grid bg-grid-fade relative h-[300px] overflow-hidden rounded-b-xl">
        <svg viewBox="0 0 660 350" className="h-full w-full" aria-label="Intelligence network preview">
          {edges.map(([a, b], i) => (
            <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#1C2B3A" strokeWidth="1.2" />
          ))}
          {nodes.map((n, i) => (
            <g key={i}>
              <circle cx={n[0]} cy={n[1]} r={n[2]} fill={n[3]} fillOpacity="0.16" stroke={n[3]} strokeOpacity="0.5" />
              <circle cx={n[0]} cy={n[1]} r="2.5" fill={n[3]} />
            </g>
          ))}
        </svg>
        <p className="gt-label absolute bottom-3 left-4">{ENTITIES.length} entities · {RELATIONSHIPS.length} relationships</p>
      </div>
    </Panel>
  );
}

export default function OverviewPage() {
  return (
    <>
      <ModuleHeader
        eyebrow="Intelligence / Overview"
        title="Investigation Overview"
        description="Command center for all locally indexed fictional investigations."
        actions={<Badge tone="success" dot>Local workspace active</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active investigations" value={INVESTIGATIONS.filter((i) => i.status === "active").length} tone="cyan" />
        <StatCard label="Indexed evidence" value={EVIDENCE.length} tone="blue" />
        <StatCard label="Identified entities" value={ENTITIES.length} tone="violet" />
        <StatCard label="Detected relationships" value={RELATIONSHIPS.length} tone="amber" />
        <StatCard label="Timeline events" value={EVENTS.length} tone="success" />
        <StatCard label="Pending review" value={EVENTS.filter((e) => e.status !== "verified").length} tone="critical" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
        <NetworkPreview />
        <div className="space-y-4">
          <Panel title="Recent investigations" eyebrow="Latest activity">
            <ul className="space-y-3">
              {INVESTIGATIONS.slice(0, 4).map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/entities?investigation=${i.id}`} className="truncate text-xs text-text-primary hover:text-cyan">
                      {i.title}
                    </Link>
                    <p className="mt-0.5 font-mono text-[0.65rem] text-text-muted">{i.id} · {i.lastActivity}</p>
                  </div>
                  <Badge tone={i.status === "active" ? "success" : "neutral"}>{i.status}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Recent activity" eyebrow="System log">
            <ul className="space-y-2.5">
              {activity.map((a) => (
                <li key={a.text} className="flex items-start gap-2.5">
                  <a.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-primary">{a.text}</p>
                    <p className="truncate font-mono text-[0.65rem] text-text-muted">{a.ref}</p>
                  </div>
                  <span className="gt-label">{a.time}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="mt-8 mb-4 flex items-end justify-between">
        <div>
          <p className="gt-label text-cyan">Case files</p>
          <h2 className="mt-1 font-display text-lg font-medium">Investigations</h2>
        </div>
        <Link href="/entities" className="gt-label flex items-center gap-1 hover:text-cyan">Browse entities <ArrowUpRight className="h-3 w-3" /></Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {INVESTIGATIONS.map((i) => (
          <article key={i.id} className="gt-panel group p-4 transition-colors hover:border-cyan/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.65rem] text-cyan">{i.id}</span>
              <Eye className="h-3.5 w-3.5 text-text-muted group-hover:text-cyan" />
            </div>
            <h3 className="mt-2 font-display text-sm font-medium text-text-primary">{i.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-secondary">{i.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5"><Badge tone="blue">{i.category}</Badge><Badge tone={i.status === "active" ? "success" : "neutral"} dot>{i.status}</Badge></div>
            <div className="mt-4 grid grid-cols-3 border-t border-panel-border/70 pt-3 text-center">
              {[
                [i.id, "evidence", 8], [i.id, "entities", 12], [i.id, "events", 16],
              ].map(([a, label, value]) => (
                <div key={label as string}>
                  <p className="font-mono text-sm text-text-primary">{value}</p>
                  <p className="gt-label">{label}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
