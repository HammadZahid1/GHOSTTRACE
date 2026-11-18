"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ENTITIES } from "@/data/scenarios";
import type { Entity } from "@/types";

interface EntityState {
  local: Entity[];
  deleted: string[];
  upsert: (entity: Entity) => void;
  remove: (id: string) => void;
}

export const useEntityStore = create<EntityState>()(
  persist(
    (set) => ({
      local: [],
      deleted: [],
      upsert: (entity) => set((s) => ({
        local: s.local.some((e) => e.id === entity.id)
          ? s.local.map((e) => (e.id === entity.id ? entity : e))
          : [...s.local, entity],
      })),
      remove: (id) => set((s) => ({
        deleted: [...new Set([...s.deleted, id])],
        local: s.local.filter((e) => e.id !== id),
      })),
    }),
    { name: "ghosttrace:entities" },
  ),
);

/** Merge built-in entities with local overrides. */
export function allEntities(local: Entity[], deleted: string[]): Entity[] {
  const byId = new Map(ENTITIES.map((e) => [e.id, e]));
  for (const e of local) byId.set(e.id, e);
  for (const id of deleted) byId.delete(id);
  return [...byId.values()];
}
