import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export type BadgeTone =
  | "cyan"
  | "blue"
  | "violet"
  | "amber"
  | "critical"
  | "success"
  | "neutral";

const tones: Record<BadgeTone, { dot: string; chip: string }> = {
  cyan: { dot: "bg-cyan", chip: "text-cyan border-cyan/30 bg-cyan/8" },
  blue: { dot: "bg-intel-blue", chip: "text-intel-blue border-intel-blue/30 bg-intel-blue/8" },
  violet: { dot: "bg-violet", chip: "text-violet border-violet/30 bg-violet/8" },
  amber: { dot: "bg-amber", chip: "text-amber border-amber/30 bg-amber/8" },
  critical: { dot: "bg-critical", chip: "text-critical border-critical/30 bg-critical/8" },
  success: { dot: "bg-success", chip: "text-success border-success/30 bg-success/8" },
  neutral: { dot: "bg-text-muted", chip: "text-text-secondary border-panel-border bg-panel-elevated" },
};

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", dot, className, children }: BadgeProps) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "font-mono text-[0.6875rem] tracking-[0.08em] uppercase",
        t.chip,
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />}
      {children}
    </span>
  );
}
