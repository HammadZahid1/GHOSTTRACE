import Link from "next/link";
import { AlertTriangle, BookOpen, ArrowRight } from "lucide-react";
import { Button, SectionHeader } from "@/components/common";

const principles = [
  {
    icon: BookOpen,
    title: "Deterministic, not “AI”",
    desc: "Every result comes from published, auditable algorithms — keyword frequency, graph traversal, rule-based pattern matching. No LLM claims, no hidden inference.",
  },
  {
    icon: AlertTriangle,
    title: "Patterns ≠ proof",
    desc: "Detected correlations and shared keywords are labeled as such. GHOSTTRACE never converts a pattern into an asserted fact, and all scenarios are fictional.",
  },
  {
    icon: EyeIcon,
    title: "Transparent methodology",
    desc: "Each visualization ships with an explanation of how it was computed, so findings can be inspected rather than trusted.",
  },
];

function EyeIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Methodology() {
  return (
    <section id="methodology" className="border-b border-panel-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Methodology & Transparency"
          title="What this platform is — and isn’t"
          description="GHOSTTRACE demonstrates forensic-analysis concepts on fictional evidence. It is an educational workstation, not an OSINT or surveillance tool."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="gt-panel p-6">
              <p.icon className="h-5 w-5 text-amber" />
              <h3 className="mt-4 font-display text-base font-medium text-text-primary">{p.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 100%, rgba(0,213,255,0.09), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="gt-label text-cyan">Ready when you are</p>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Load the first scenario.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Pick a fictional investigation, index its evidence, and start
          tracing connections — all locally, all in your browser.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/workspace">
            <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Launch Investigation
            </Button>
          </Link>
          <Link href="/#architecture">
            <Button variant="secondary" size="lg">
              Read the Architecture
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const footerGroups = [
  {
    title: "Platform",
    links: [
      ["Capabilities", "#capabilities"],
      ["Methodology", "#methodology"],
      ["Architecture", "#architecture"],
    ],
  },
  {
    title: "Workspace",
    links: [
      ["Overview", "/workspace"],
      ["Evidence Vault", "/evidence"],
      ["Connection Graph", "/graph"],
      ["Timeline", "/timeline"],
    ],
  },
  {
    title: "Data",
    links: [
      ["Privacy", "#"],
      ["Fictional scenarios", "#"],
      ["Export & import", "#"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-panel-border/60 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold text-text-primary">
            GHOST<span className="text-cyan">TRACE</span>
          </p>
          <p className="gt-label mt-1">Intelligence Investigation System</p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-text-muted">
            “Uncover the Connections. Reconstruct the Truth.”
            An educational demonstration platform. All scenarios, entities,
            and evidence are fictional.
          </p>
        </div>
        {footerGroups.map((g) => (
          <div key={g.title}>
            <p className="gt-label">{g.title}</p>
            <ul className="mt-3 space-y-2">
              {g.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-text-secondary transition-colors hover:text-cyan">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-panel-border/60 px-6 pt-6 sm:flex sm:items-center sm:justify-between">
        <p className="font-mono text-[0.65rem] text-text-muted">
          GHOSTTRACE v0.1 · local workspace · no external transmission
        </p>
        <p className="gt-label mt-2 sm:mt-0">© 2026 · MIT License</p>
      </div>
    </footer>
  );
}
