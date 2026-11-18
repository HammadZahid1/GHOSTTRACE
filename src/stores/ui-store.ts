"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  /** Desktop sidebar collapsed state (persisted). */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  /** Mobile drawer visibility. */
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  /** Global command palette visibility (Ctrl/Cmd+K). */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      mobileNavOpen: false,
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
      paletteOpen: false,
      setPaletteOpen: (open) => set({ paletteOpen: open }),
    }),
    {
      name: "ghosttrace:ui-preferences",
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    },
  ),
);
