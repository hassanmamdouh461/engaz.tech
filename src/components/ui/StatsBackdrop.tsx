/**
 * Backdrop for the impact counters: concentric orbit rings over a soft radial aura.
 * Deliberately frameless so the numbers read as the subject, not a boxed screenshot.
 */
export function StatsBackdrop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 460 460"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="statsAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.26" />
          <stop offset="45%" stopColor="#1d4ed8" stopOpacity="0.11" />
          <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
        </radialGradient>

        {/* Rings fade at top and bottom so they never close into a hard circle. */}
        <linearGradient id="statsRing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
          <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.55" />
          <stop offset="65%" stopColor="#60a5fa" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="230" cy="230" r="228" fill="url(#statsAura)" />

      <g stroke="url(#statsRing)" fill="none">
        <circle cx="230" cy="230" r="96" strokeWidth="1" opacity="0.5" />
        <circle cx="230" cy="230" r="146" strokeWidth="1" opacity="0.36" />
        <circle cx="230" cy="230" r="196" strokeWidth="1" opacity="0.24" />
      </g>

      {/* Accent nodes on the rings, suggesting systems in orbit. */}
      <g fill="#60a5fa">
        <circle cx="230" cy="134" r="3.5" opacity="0.85" />
        <circle cx="376" cy="230" r="3" opacity="0.5" />
        <circle cx="84" cy="230" r="3" opacity="0.45" />
      </g>
    </svg>
  );
}
