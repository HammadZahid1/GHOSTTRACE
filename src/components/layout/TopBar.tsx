"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { CollapseButton } from "./Sidebar";
import { useUIStore } from "@/stores/ui-store";

export function TopBar() {
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-panel-border/70 bg-bg-secondary/90 px-4 backdrop-blur">
      <button
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-panel-border text-text-secondary hover:text-cyan lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <CollapseButton />

      <button
        onClick={() => setPaletteOpen(true)}
        className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-panel-border bg-panel px-3 text-left text-xs text-text-muted transition-colors hover:border-cyan/40 sm:max-w-sm"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 truncate">Search modules, evidence, investigations…</span>
        <kbd className="rounded border border-panel-border bg-bg-primary px-1.5 py-0.5 font-mono text-[0.6rem] text-text-muted">
          Ctrl K
        </kbd>
      </button>

      <Link
        href="/"
        className="ml-auto gt-label hidden transition-colors hover:text-cyan sm:block"
      >
        Exit to site
      </Link>
    </header>
  );
}
