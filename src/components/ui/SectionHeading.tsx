"use client";

import { motion } from "framer-motion";
import { MarkedText } from "@/components/ui/MarkedText";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type Accent = "yellow" | "cyan" | "pink" | "mint";

const SLAB: Record<Accent, string> = {
  yellow: "bg-brand-yellow",
  cyan: "bg-brand-cyan",
  pink: "bg-brand-pink",
  mint: "bg-brand-mint",
};

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  accent?: Accent;
  align?: "center" | "start";
  className?: string;
}

/**
 * The eyebrow is a coloured slab with a hard edge and a slight tilt, so it reads as
 * a label stuck onto the page rather than as text floating above the heading.
 */
export function SectionHeading({
  eyebrow,
  heading,
  body,
  accent = "yellow",
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        "flex flex-col gap-4 sm:gap-5",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className,
      )}
    >
      {eyebrow ? (
        <motion.span
          variants={fadeInUp}
          className={cn(
            "inline-block -rotate-1 border-3 border-edge px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-black shadow-neo-3 sm:px-3 sm:text-xs sm:tracking-[0.2em]",
            SLAB[accent],
          )}
        >
          {eyebrow}
        </motion.span>
      ) : null}

      <motion.h2 variants={fadeInUp} className="neo-h2 max-w-3xl">
        {heading}
      </motion.h2>

      {body ? (
        <motion.p
          variants={fadeInUp}
          className="max-w-2xl text-sm leading-relaxed text-ink/80 xs:text-base sm:text-lg"
        >
          <MarkedText text={body} />
        </motion.p>
      ) : null}
    </motion.div>
  );
}
