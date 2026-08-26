import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * `scroll-mt` clears the sticky header when an anchor lands, and it has to grow
 * with the header: the mobile bar is shorter than the desktop one.
 */
export function Section({ id, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 px-3 py-10 sm:px-6 sm:py-14 lg:scroll-mt-28 lg:px-12 lg:py-16",
        className,
      )}
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl">{children}</div>
    </section>
  );
}
