"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: ReactNode[];
  direction?: "forward" | "reverse";
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  items,
  direction = "forward",
  className,
  itemClassName,
}: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("marquee-mask relative overflow-hidden", className)}>
      <ul
        dir="ltr"
        className={cn(
          "flex w-max items-center gap-4",
          direction === "forward" ? "animate-marquee" : "animate-marquee-reverse",
        )}
      >
        {doubled.map((item, index) => (
          <li
            key={index}
            aria-hidden={index >= items.length}
            className={cn("shrink-0", itemClassName)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
