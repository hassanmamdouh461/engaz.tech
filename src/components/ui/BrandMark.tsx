/**
 * Brand mark: code chevrons flanking a check, matching the Engaz logo — the
 * "delivered code" idea in a single glyph.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 9 L4 16 L9 23" />
      <path d="M23 9 L28 16 L23 23" />
      <path d="M12.5 16.5 L15.5 19.5 L20 12" />
    </svg>
  );
}
