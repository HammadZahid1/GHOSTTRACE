import { cn } from "@/utils/cn";
import type { BadgeTone } from "./Badge";

export interface StatCardProps {
  label: string;
  value: string | number;
  tone?: BadgeTone;
  hint?: string;
}

const toneText: Record<BadgeTone, string> = {
  cyan: "text-cyan",
  blue: "text-intel-blue",
  violet: "text-violet",
  amber: "text-amber",
  critical: "text-critical",
  success: "text-success",
  neutral: "text-text-primary",
};

export function StatCard({ label, value, tone = "neutral", hint }: StatCardProps) {
  return (
    <div className="gt-panel px-4 py-3.5">
      <p className="gt-label">{label}</p>
      <p
        className={cn(
          "mt-1.5 font-display text-2xl font-semibold tabular-nums",
          toneText[tone],
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 font-mono text-[0.65rem] text-text-muted">{hint}</p>}
    </div>
  );
}
