export function CountryOutline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 460"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="outlineHatch"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 14 L14 0" stroke="#1e40af" strokeWidth="0.6" opacity="0.35" />
        </pattern>
      </defs>

      {/* Stylized national outline used as the backdrop for the impact counters. */}
      <path
        d="M132 12 L150 30 L178 26 L196 44 L228 40 L246 60 L268 58 L286 78
           L300 112 L296 148 L306 180 L318 196 L330 232 L344 258 L356 288
           L344 306 L318 318 L296 342 L278 372 L252 398 L224 420 L196 434
           L170 428 L152 406 L140 378 L124 352 L106 322 L92 290 L84 256
           L74 220 L62 186 L54 150 L48 112 L58 78 L78 52 L104 30 Z"
        fill="url(#outlineHatch)"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
