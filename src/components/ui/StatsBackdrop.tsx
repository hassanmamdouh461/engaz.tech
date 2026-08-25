/**
 * Backdrop for the impact counters: a stylized terminal window over a wireframe
 * globe, standing in for "software we ship, running everywhere".
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
        <pattern id="statsGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 L0 20" stroke="#1e40af" strokeWidth="0.5" opacity="0.4" />
        </pattern>
        <radialGradient id="statsFade" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="statsMask">
          <circle cx="230" cy="230" r="200" fill="url(#statsFade)" />
        </mask>
      </defs>

      <g mask="url(#statsMask)">
        <circle cx="230" cy="230" r="198" fill="url(#statsGrid)" />

        {/* Longitude and latitude sweeps read as a globe without a full map. */}
        <circle cx="230" cy="230" r="198" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="230" cy="230" rx="66" ry="198" stroke="#3b82f6" strokeWidth="1" opacity="0.35" />
        <ellipse cx="230" cy="230" rx="134" ry="198" stroke="#3b82f6" strokeWidth="1" opacity="0.25" />
        <line x1="32" y1="230" x2="428" y2="230" stroke="#3b82f6" strokeWidth="1" opacity="0.35" />
        <ellipse cx="230" cy="230" rx="198" ry="72" stroke="#3b82f6" strokeWidth="1" opacity="0.25" />
        <ellipse cx="230" cy="230" rx="198" ry="140" stroke="#3b82f6" strokeWidth="1" opacity="0.2" />
      </g>

      {/* Terminal frame centred on the globe. */}
      <g opacity="0.75">
        <rect
          x="96"
          y="132"
          width="268"
          height="196"
          rx="14"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="#0b0f19"
          fillOpacity="0.55"
        />
        <line x1="96" y1="166" x2="364" y2="166" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
        <circle cx="116" cy="149" r="4" fill="#3b82f6" />
        <circle cx="132" cy="149" r="4" fill="#3b82f6" opacity="0.55" />
        <circle cx="148" cy="149" r="4" fill="#3b82f6" opacity="0.3" />
      </g>
    </svg>
  );
}
