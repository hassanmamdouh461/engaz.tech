"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { dropIn, press, viewportOnce } from "@/lib/motion";

export type Accent = "cyan" | "yellow" | "pink" | "mint";

const STRIPE: Record<Accent, string> = {
  cyan: "bg-brand-cyan",
  yellow: "bg-brand-yellow",
  pink: "bg-brand-pink",
  mint: "bg-brand-mint",
};

const ICON: Record<Accent, string> = {
  cyan: "text-brand-cyan",
  yellow: "text-brand-yellow",
  pink: "text-brand-pink",
  mint: "text-brand-mint",
};

/** The accent cycles by position so a grid never shows two identical stripes side by side. */
const CYCLE: Accent[] = ["cyan", "yellow", "pink", "mint"];

export function accentFor(index: number): Accent {
  return CYCLE[index % CYCLE.length];
}

/**
 * The workhorse card: a hard-edged slab with a coloured stripe along the top edge,
 * an oversized icon, and the press on hover. `filled` swaps the surface for the
 * accent itself, used to break up long grids.
 */
export function NeoCard({
  index,
  icon: Icon,
  title,
  body,
  footer,
  filled = false,
  accent,
  className,
}: {
  index: number;
  icon?: LucideIcon;
  title: string;
  body?: string;
  footer?: ReactNode;
  filled?: boolean;
  accent?: Accent;
  className?: string;
}) {
  const tone = accent ?? accentFor(index);

  return (
    <motion.article
      variants={dropIn(index % 2 === 0 ? -1.5 : 1.5)}
      whileHover={press(8)}
      className={cn(
        "relative flex h-full flex-col overflow-hidden border-4 border-edge p-5 shadow-neo-8 sm:p-7",
        filled ? "bg-brand-yellow text-black" : "bg-surface text-ink",
        className,
      )}
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1.5", STRIPE[tone])} />

      <div className="flex items-center gap-4 border-b-4 border-edge pb-4">
        {Icon ? (
          <Icon
            aria-hidden
            className={cn("h-10 w-10 shrink-0 sm:h-12 sm:w-12", filled ? "text-black" : ICON[tone])}
          />
        ) : null}
        <h3 className="neo-h3">{title}</h3>
      </div>

      {body ? (
        <p className="mt-4 text-sm leading-relaxed text-current opacity-80 sm:text-base">{body}</p>
      ) : null}

      {footer ? <div className="mt-5">{footer}</div> : null}
    </motion.article>
  );
}

export { viewportOnce };
