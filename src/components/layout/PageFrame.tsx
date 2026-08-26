import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The framed page. Everything sits inside a bordered slab floating on the void
 * colour, which is the defining structural gesture of this design: the site reads
 * as a sheet of paper placed on a surface, not as a browser window.
 *
 * The frame thins out on small screens. At phone width a 6px border and a 12px
 * shadow eat most of a 360px viewport, and the gesture stops reading as a frame
 * and starts reading as wasted margin.
 */
export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="px-1.5 pb-1.5 pt-3 sm:px-3 sm:pb-3 lg:px-5 lg:pb-5">
      <div
        className={cn(
          // svh, not vh: vh measures past mobile browser chrome, which leaves the
          // frame taller than the visible area and a dead strip below the footer.
          "neo-paper relative mx-auto min-h-[calc(100svh-1.5rem)] max-w-[1400px] border-3 border-edge pt-3",
          "shadow-neo-4 sm:border-4 sm:shadow-neo-8 lg:border-6 lg:pt-4 lg:shadow-neo-12",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
