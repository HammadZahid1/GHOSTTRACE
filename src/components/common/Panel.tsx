import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export interface PanelProps {
  title?: string;
  eyebrow?: string;
  actions?: ReactNode;
  elevated?: boolean;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function Panel({
  title,
  eyebrow,
  actions,
  elevated,
  className,
  contentClassName,
  children,
}: PanelProps) {
  return (
    <section className={cn(elevated ? "gt-panel-elevated" : "gt-panel", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-panel-border/70 px-4 py-3">
          <div className="min-w-0">
            {eyebrow && <p className="gt-label mb-0.5">{eyebrow}</p>}
            {title && (
              <h2 className="truncate font-display text-sm font-medium text-text-primary">
                {title}
              </h2>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn("p-4", contentClassName)}>{children}</div>
    </section>
  );
}
