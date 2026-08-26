import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The framed page. Everything sits inside a bordered slab floating on the void
 * colour, which is the defining structural gesture of this design: the site reads
 * as a sheet of paper placed on a surface, not as a browser window.
 */
export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="px-[10px] pb-[10px] pt-3 sm:px-5 sm:pb-5">
      <div
        className={cn(
          "neo-paper relative mx-auto min-h-[calc(100vh-40px)] max-w-[1400px] border-6 border-edge pt-4 shadow-neo-12",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
