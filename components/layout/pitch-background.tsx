/* Football-themed fixed background: mowed-grass stripes, halftone dots, faint
   pitch markings, and ball + trophy watermarks. Ported from the prototype.
   Purely decorative — hidden from assistive tech. */
export function PitchBackground() {
  const line = "var(--text)";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* mowed-grass vertical stripes */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, color-mix(in srgb, var(--text) 2.6%, transparent) 0 70px, transparent 70px 140px)",
        }}
      />
      {/* halftone dots */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--text) 5%, transparent) 1.3px, transparent 1.4px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* pitch markings */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 opacity-50"
      >
        <g fill="none" stroke={line} strokeWidth="2.5" strokeOpacity="0.07">
          <line x1="-50" y1="120" x2="1250" y2="120" />
          <circle cx="600" cy="120" r="120" />
          <circle cx="600" cy="120" r="6" fill={line} fillOpacity="0.07" stroke="none" />
          <rect x="430" y="-200" width="340" height="320" />
          <rect x="520" y="-200" width="160" height="200" />
          <path d="M470 120 a120 70 0 0 0 260 0" />
        </g>
      </svg>
      {/* soccer-ball watermark, bottom-right */}
      <svg
        width="460"
        height="460"
        viewBox="0 0 100 100"
        className="absolute opacity-[0.07]"
        style={{ right: -95, bottom: -95 }}
      >
        <g fill="none" stroke={line} strokeWidth="2">
          <circle cx="50" cy="50" r="46" />
          <polygon points="50,30 67,42 60,62 40,62 33,42" fill={line} fillOpacity=".55" stroke="none" />
          <g strokeWidth="1.6">
            <path d="M50,30 50,12 M67,42 82,33 M60,62 72,76 M40,62 28,76 M33,42 18,33" />
            <path d="M50,12 33,20 33,42 M50,12 67,20 67,42 M82,33 78,55 60,62 M18,33 22,55 40,62 M72,76 52,82 40,62 M28,76 48,82 60,62" />
          </g>
        </g>
      </svg>
      {/* trophy watermark, top-left */}
      <svg
        width="240"
        height="240"
        viewBox="0 0 24 24"
        className="absolute opacity-[0.055]"
        style={{ left: -50, top: 60 }}
        fill="none"
        stroke={line}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 4h12v4a6 6 0 0 1-12 0V4Z" />
        <path d="M6 6H4a2 2 0 0 0 0 4h2M18 6h2a2 2 0 0 1 0 4h-2M9 18h6M10 18v-3M14 18v-3M8 21h8" />
      </svg>
    </div>
  );
}
