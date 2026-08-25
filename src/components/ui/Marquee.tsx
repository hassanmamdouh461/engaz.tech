"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: ReactNode[];
  direction?: "forward" | "reverse";
  /** Pause the scroll while the cursor is over the track, so items can be read. */
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  items,
  direction = "forward",
  pauseOnHover = false,
  className,
  itemClassName,
}: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("marquee-mask group relative overflow-hidden", className)}>
      <ul
        dir="ltr"
        className={cn(
          "flex w-max items-center gap-3",
          direction === "forward" ? "animate-marquee" : "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
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
