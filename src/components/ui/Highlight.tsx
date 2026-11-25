"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ACCENT_BG, type Accent } from "@/lib/accents";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/reduced-motion";

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
}: {
  children: ReactNode;
  color?: Accent;
  from?: "start" | "end";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.6"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // Reduced motion gets the finished stroke instead of one drawn by scroll.
  const reduceMotion = useReducedMotion();

  return (
    <span
      ref={ref}
      className="relative isolate mx-[0.1rem] inline-block rounded-[3px] px-2 py-[0.1rem] font-semibold"
    >
      <motion.span
        aria-hidden
        style={{
          width: reduceMotion ? "100%" : width,
          insetInlineStart: from === "start" ? "-2px" : undefined,
          insetInlineEnd: from === "end" ? "-2px" : undefined,
        }}
        className={cn("absolute -inset-y-[2px] -z-10 rounded-[3px]", ACCENT_BG[color])}
      />
      {children}
    </span>
  );
}
