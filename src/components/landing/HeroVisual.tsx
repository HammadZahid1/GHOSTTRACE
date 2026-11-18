"use client";

import dynamic from "next/dynamic";


import { useSyncExternalStore } from "react";

const IntelligenceCore = dynamic(
  () => import("@/components/visuals/IntelligenceCore"),
  { ssr: false, loading: () => <CoreFallback /> },
);

const noopSubscribe = () => () => {};
let webglCache: boolean | undefined;

function getWebglSnapshot(): boolean {
  if (webglCache === undefined) {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") ?? c.getContext("webgl");
      webglCache = Boolean(gl);
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}

function CoreFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="gt-label animate-pulse">initializing intelligence coreâ€¦</span>
    </div>
  );
}

function StaticFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 rounded-full border border-cyan/30 bg-cyan/5" />
    </div>
  );
}

/**
 * Hero visual centerpiece â€” procedural Three.js intelligence core
 * with a graceful fallback when WebGL is unavailable.
 */
export function HeroVisual() {
  const webgl = useSyncExternalStore(
    noopSubscribe,
    getWebglSnapshot,
    () => true,
  );

  return (
    <div className="gt-glow relative aspect-square w-full max-w-[560px] justify-self-center">
      <div className="absolute inset-0 rounded-full border border-cyan/10" aria-hidden />
      <div className="absolute inset-[12%] rounded-full border border-cyan/20" aria-hidden />

      {webgl ? <IntelligenceCore /> : <StaticFallback />}
    </div>
  );
}


