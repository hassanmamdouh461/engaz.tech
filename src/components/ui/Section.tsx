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
      className={cn("relative scroll-mt-28 px-4 py-12 sm:px-8 sm:py-16 lg:px-12", className)}
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl">{children}</div>
    </section>
  );
}
