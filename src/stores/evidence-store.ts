"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EVIDENCE } from "@/data/scenarios";
import type { EvidenceDocument } from "@/types";

const ALLOWED = ["txt", "csv", "json", "md"];
const MAX_BYTES = 2 * 1024 * 1024;

export interface ImportResult { added: number; errors: string[] }

interface EvidenceState {
  items: EvidenceDocument[];
  importFiles: (files: FileList | File[], investigationId: string) => Promise<ImportResult>;
  remove: (id: string) => void;
  addText: (name: string, content: string, investigationId: string) => void;
}

export const useEvidenceStore = create<EvidenceState>()(
  persist(
    (set) => ({
      items: EVIDENCE,
      importFiles: async (files, investigationId) => {
        const errors: string[] = [];
        const added: EvidenceDocument[] = [];
        for (const file of Array.from(files)) {
          const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
          if (!ALLOWED.includes(ext)) {
            errors.push(`${file.name}: unsupported type (.${ext})`);
            continue;
          }
          if (file.size > MAX_BYTES) {
            errors.push(`${file.name}: exceeds 2 MB limit`);
            continue;
          }
          try {
            const content = await file.text(); // untrusted text, never executed
            if (ext === "json") JSON.parse(content); // validate malformed JSON early
            added.push({
              id: `EVD-LOCAL-${Date.now().toString(36)}-${added.length}`,
              investigationId,
              filename: file.name,
              type: ext as EvidenceDocument["type"],
              category: "note",
              content,
              sourceType: "local",
              importedAt: new Date().toISOString(),
              wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
            });
          } catch {
            errors.push(`${file.name}: malformed or unreadable file`);
          }
        }
        if (added.length) set((s) => ({ items: [...s.items, ...added] }));
        return { added: added.length, errors };
      },
      addText: (name, content, investigationId) =>
        set((s) => ({
          items: [...s.items, {
            id: `EVD-LOCAL-${Date.now().toString(36)}`,
            investigationId,
            filename: name,
            type: "txt",
            category: "note",
            content,
            sourceType: "local",
            importedAt: new Date().toISOString(),
            wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
          }],
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((e) => e.id !== id) })),
    }),
    {
      name: "ghosttrace:evidence",
      // Avoid storing large imported contents in localStorage.
      partialize: (s) => ({
        items: s.items.filter((i) => i.sourceType === "scenario"),
      }),
    },
  ),
);
