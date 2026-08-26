"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const word: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
 * The pieces are hidden from assistive tech, so the heading around them must carry an
 * `aria-label` with the full string, or a screen reader reads it one word at a time. The
 * text is deliberately not repeated in a visually hidden copy: that puts the headline into
 * the markup twice, which a crawler reads as duplicated wording.
 */
export function SplitText({ text, className, stagger = 0.055, delay = 0 }: SplitTextProps) {
  const words = text.split(" ");
  // Server-rendered markup must show the text. Framer applies the hidden variant during
  // SSR too, which shipped every word translated out of its mask and left the first paint
  // with no visible heading at all; animating only after mount avoids that.
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={ready ? "visible" : false}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={cn("inline-block", className)}
    >
      {words.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            variants={word}
            initial={ready ? "hidden" : false}
            className="inline-block"
          >
            {value}
          </motion.span>
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.span>
  );
}
