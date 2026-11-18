"use client";

import { useEffect } from "react";
import { CommandPalette } from "./CommandPalette";
import { useUIStore } from "@/stores/ui-store";

export function PaletteHost() {
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.setPaletteOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        setOpen(!open);
      } else if ((e.ctrlKey || e.metaKey) && key === "f" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (key === "escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return open ? <CommandPalette /> : null;
}
