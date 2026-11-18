"use client";

import { create } from "zustand";

export interface AnalysisRecord {
  id: string;
  at: string;
  words: number;
  keywords: number;
}

interface AnalysisState {
  history: AnalysisRecord[];
  add: (record: AnalysisRecord) => void;
  clear: () => void;
}

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  history: [],
  add: (record) => set((s) => ({ history: [record, ...s.history].slice(0, 50) })),
  clear: () => set({ history: [] }),
}));
