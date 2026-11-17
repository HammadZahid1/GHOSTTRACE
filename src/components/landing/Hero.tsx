import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/common";
import { HeroVisual } from "./HeroVisual";

const stats = [
  { label: "Analysis modules", value: "10" },
  { label: "Local engines", value: "8" },
  { label: "Sample scenarios", value: "4" },
  { label: "External calls", value: "0" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-panel-border/60">
      {/* atmospheric backdrop */}
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 30%, rgba(0,213,255,0.07), transparent 65%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(52,120,255,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-24 pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-32 lg:pb-28">
        <div>
          <div className="gt-panel inline-flex items-center gap-2 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            <span className="gt-label text-text-secondary">
              Local workspace · no data leaves your browser
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-[4.25rem]">
            See Beyond the{" "}
            <span className="text-cyan [text-shadow:0_0_36px_rgba(0,213,255,0.35)]">
              Evidence.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            An advanced digital intelligence environment for uncovering
            patterns, mapping connections, and reconstructing complex
            investigations — entirely in your browser.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/workspace">
              <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                Launch Investigation
              </Button>
            </Link>
            <Link href="/#capabilities">
              <Button variant="secondary" size="lg">
                Explore Capabilities
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-4 gap-4 border-t border-panel-border/70 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="gt-label">{s.label}</dt>
                <dd className="mt-1 font-mono text-xl text-text-primary tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
