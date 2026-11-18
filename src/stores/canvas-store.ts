"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CanvasKind = "evidence" | "entity" | "event" | "note" | "group";
export interface CanvasNode {
  id: string;
  kind: CanvasKind;
  title: string;
  body: string;
  x: number;
  y: number;
}
export interface CanvasEdge { id: string; from: string; to: string; label: string }

interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  setNodes: (nodes: CanvasNode[]) => void;
  addNode: (node: CanvasNode) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => void;
  reset: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      nodes: [], edges: [],
      setNodes: (nodes) => set({ nodes }),
      addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
      removeNode: (id) => set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== id),
        edges: s.edges.filter((e) => e.from !== id && e.to !== id),
      })),
      addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),
      reset: () => set({ nodes: [], edges: [] }),
    }),
    { name: "ghosttrace:canvas" },
  ),
);
