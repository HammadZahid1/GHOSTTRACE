"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RELATIONSHIPS } from "@/data/scenarios";
import type { Relationship, RelationshipType } from "@/types";

interface RelationshipState {
  local: Relationship[];
  deleted: string[];
  add: (rel: Relationship) => void;
  remove: (id: string) => void;
}

export const useRelationshipStore = create<RelationshipState>()(
  persist(
    (set) => ({
      local: [], deleted: [],
      add: (rel) => set((s) => ({ local: [...s.local, rel] })),
      remove: (id) => set((s) => ({ deleted: [...new Set([...s.deleted, id])] })),
    }),
    { name: "ghosttrace:relationships" },
  ),
);

export function allRelationships(local: Relationship[], deleted: string[]): Relationship[] {
  return [...RELATIONSHIPS, ...local].filter((r) => !deleted.includes(r.id));
}

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  "associated_with", "member_of", "located_at", "authored",
  "referenced", "funded", "communicated_with", "participated_in",
];
