"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

const word: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SplitTextProps {
  text: string;
  className?: string;
  /** Seconds between consecutive words. */
  stagger?: number;
  delay?: number;
}

/**
 * Word-by-word masked reveal. Each word sits in its own overflow-hidden box and rises from
 * fully below the mask, so the words appear to be uncovered rather than faded in.
 *
 * The whole string is exposed once to assistive tech; the visual pieces are hidden from it,
 * otherwise a screen reader announces the headline one word at a time.
 */
export function SplitText({ text, className, stagger = 0.055, delay = 0 }: SplitTextProps) {
  const words = text.split(" ");

  return (
    <motion.span
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={cn("inline-block", className)}
    >
      <span className="sr-only">{text}</span>
      {words.map((value, index) => (
        <span
          key={`${value}-${index}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span variants={word} className="inline-block">
            {value}
          </motion.span>
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.span>
  );
}
