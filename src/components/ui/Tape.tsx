import { cn } from "@/lib/cn";

/**
 * Translucent tape. Two hairline creases sell the read as a strip of tape laid
 * over the surface rather than a plain yellow rectangle.
 */
export function Tape({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        "pointer-events-none absolute rounded-[2px] border-2 border-black/10 bg-brand-yellow/70 shadow-tape",
        "before:absolute before:inset-x-[10%] before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-black/5 before:content-['']",
        "after:absolute after:inset-x-[10%] after:top-[30%] after:h-px after:bg-black/5 after:content-['']",
        className,
      )}
    />
  );
}
