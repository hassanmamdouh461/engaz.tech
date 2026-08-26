"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type HighlightColor = "yellow" | "cyan" | "pink" | "mint";

const FILL: Record<HighlightColor, string> = {
  yellow: "bg-brand-yellow",
  cyan: "bg-brand-cyan",
  pink: "bg-brand-pink",
  mint: "bg-brand-mint",
};

/**
 * Highlighter-pen reveal. The marker is a layer behind the text whose width is
 * driven by scroll, inset a couple of pixels on each side so the ink overshoots
 * the glyphs the way a real marker does.
 *
 * `from` alternates across the copy so consecutive highlights sweep in from
 * opposite sides.
 */
export function Highlight({
  children,
  color = "yellow",
  from = "start",
  className,
}: {
  children: ReactNode;
  color?: HighlightColor;
  from?: "start" | "end";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.6"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <span
      ref={ref}
      className={cn(
        "relative isolate mx-[0.1rem] inline-block rounded-[3px] px-2 py-[0.1rem] font-semibold",
        className,
      )}
    >
      <motion.span
        aria-hidden
        style={{
          width: reduceMotion ? "100%" : width,
          insetInlineStart: from === "start" ? "-2px" : undefined,
          insetInlineEnd: from === "end" ? "-2px" : undefined,
        }}
        className={cn("absolute -inset-y-[2px] -z-10 rounded-[3px]", FILL[color])}
      />
      {children}
    </span>
  );
}
