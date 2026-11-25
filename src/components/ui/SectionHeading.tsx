"use client";

import { motion } from "framer-motion";
import { MarkedText } from "@/components/ui/MarkedText";
import { ACCENT_BG, type Accent } from "@/lib/accents";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  accent?: Accent;
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
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex flex-col items-start gap-4 text-start sm:gap-5"
    >
      {eyebrow ? (
        <motion.span
          variants={fadeInUp}
          className={cn(
            "inline-block -rotate-1 border-3 border-edge px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-black shadow-neo-3 sm:px-3 sm:text-xs sm:tracking-[0.2em]",
            ACCENT_BG[accent],
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
