"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search, X } from "lucide-react";
import { NAV_COMMANDS } from "@/config/navigation";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/utils/cn";

export function CommandPalette() {
  const router = useRouter();
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.setPaletteOpen);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return NAV_COMMANDS.filter(
      (c) => !q || c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="gt-panel-elevated relative w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 border-b border-panel-border px-4">
          <Search className="h-4 w-4 text-cyan" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
              if (e.key === "Enter" && results[selected]) go(results[selected].href);
            }}
            placeholder="Search modules and commands…"
            className="h-12 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
          <button onClick={() => setOpen(false)} aria-label="Close palette" className="text-text-muted hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          <p className="gt-label px-2 py-1.5">Navigate</p>
          {results.length === 0 && <p className="px-2 py-6 text-center text-xs text-text-muted">No matching commands</p>}
          {results.map((c, i) => (
            <button
              key={c.href}
              onMouseEnter={() => setSelected(i)}
              onClick={() => go(c.href)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                i === selected ? "bg-cyan/10 text-cyan" : "text-text-secondary hover:bg-panel-elevated",
              )}
            >
              <c.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{c.label}</span>
              <span className="gt-label">{c.group}</span>
              {i === selected && <CornerDownLeft className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
        <div className="border-t border-panel-border px-4 py-2">
          <p className="gt-label">↑↓ navigate · ↵ open · esc close · ctrl+f search</p>
        </div>
      </div>
    </div>
  );
}
