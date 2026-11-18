"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INVESTIGATIONS } from "@/data/scenarios";
import type { Investigation } from "@/types";

interface InvestigationState {
  investigations: Investigation[];
  activeId: string;
  setActive: (id: string) => void;
  duplicate: (id: string) => string | null;
  archive: (id: string) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useInvestigationStore = create<InvestigationState>()(
  persist(
    (set, get) => ({
      investigations: INVESTIGATIONS,
      activeId: INVESTIGATIONS[0].id,
      setActive: (id) => set({ activeId: id }),
      duplicate: (id) => {
        const src = get().investigations.find((i) => i.id === id);
        if (!src) return null;
        const newId = `INV-${String(get().investigations.length + 1).padStart(3, "0")}`;
        const copy: Investigation = {
          ...src, id: newId, title: `${src.title} (copy)`,
          status: "active", archived: false, duplicatedFrom: id,
          createdAt: new Date().toISOString().slice(0, 10),
          lastActivity: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ investigations: [...s.investigations, copy], activeId: newId }));
        return newId;
      },
      archive: (id) => set((s) => ({
        investigations: s.investigations.map((i) =>
          i.id === id ? { ...i, archived: !i.archived, status: i.archived ? "active" : "archived" } : i),
      })),
      remove: (id) => set((s) => ({
        investigations: s.investigations.filter((i) => i.id !== id),
        activeId: s.activeId === id ? (s.investigations[0]?.id ?? "") : s.activeId,
      })),
      reset: () => set({ investigations: INVESTIGATIONS, activeId: INVESTIGATIONS[0].id }),
    }),
    { name: "ghosttrace:investigations" },
  ),
);
