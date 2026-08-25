export function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base-950" />
      <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-60" />

      {/* Blurred SVG auras drifting on long, offset loops so the background never looks static. */}
      <svg
        className="absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="auraCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="auraBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="auraSky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <filter id="auraBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
        </defs>

        <g filter="url(#auraBlur)">
          <ellipse
            cx="230"
            cy="220"
            rx="290"
            ry="240"
            fill="url(#auraCyan)"
            className="animate-drift-a"
          />
          <ellipse
            cx="790"
            cy="380"
            rx="320"
            ry="270"
            fill="url(#auraBlue)"
            className="animate-drift-b"
          />
          <ellipse
            cx="480"
            cy="800"
            rx="300"
            ry="230"
            fill="url(#auraSky)"
            className="animate-drift-c"
          />
        </g>
      </svg>

      <div className="absolute inset-0 noise-overlay opacity-[0.035] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-950/40 to-base-950" />
    </div>
  );
}
