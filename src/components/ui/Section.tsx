import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20 md:py-28", className)}
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl">{children}</div>
    </section>
  );
}
