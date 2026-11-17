"use client";

/**
 * Hero visual centerpiece. Replaced by the procedural Three.js
 * intelligence core in a follow-up milestone (dynamic import).
 */
export function HeroVisual() {
  return (
    <div className="gt-glow relative aspect-square w-full max-w-[560px] justify-self-center">
      <div className="absolute inset-0 rounded-full border border-cyan/15" aria-hidden />
      <div className="absolute inset-[12%] rounded-full border border-cyan/25" aria-hidden />
      <div className="absolute inset-[26%] rounded-full border border-panel-border" aria-hidden />

      {/* static constellation placeholder */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Stylized intelligence network preview"
      >
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3478FF" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {[
          [200, 90], [110, 140], [300, 150], [90, 260],
          [310, 270], [170, 320], [255, 55], [350, 200],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1="200" y1="200" x2={x} y2={y} stroke="#1C2B3A" strokeWidth="1" />
            <circle cx={x} cy={y} r="3.5" fill="#3478FF" />
          </g>
        ))}
        <circle cx="200" cy="200" r="26" fill="url(#core)" />
        <circle cx="200" cy="200" r="26" fill="none" stroke="#00D5FF" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}
