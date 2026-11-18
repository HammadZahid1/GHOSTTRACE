"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimelineEvent } from "@/types";

interface TimelineState {
  local: TimelineEvent[];
  deleted: string[];
  upsert: (event: TimelineEvent) => void;
  remove: (id: string) => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      local: [], deleted: [],
      upsert: (event) => set((s) => ({
        local: s.local.some((e) => e.id === event.id)
          ? s.local.map((e) => (e.id === event.id ? event : e)) : [...s.local, event],
      })),
      remove: (id) => set((s) => ({ deleted: [...new Set([...s.deleted, id])], local: s.local.filter((e) => e.id !== id) })),
    }),
    { name: "ghosttrace:timeline" },
  ),
);
