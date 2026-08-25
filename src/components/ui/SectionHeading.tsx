"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  align?: "center" | "start";
  className?: string;
}

/**
 * Display heading: oversized, left-aligned, with the supporting paragraph directly
 * beneath it. `eyebrow` is optional — most sections lead with the headline itself.
 */
export function SectionHeading({
  eyebrow,
  heading,
  body,
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
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className,
      )}
    >
      {eyebrow ? (
        <motion.span
          variants={fadeInUp}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400"
        >
          {eyebrow}
        </motion.span>
      ) : null}

      <motion.h2
        variants={fadeInUp}
        className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
      >
        {heading}
      </motion.h2>

      {body ? (
        <motion.p
          variants={fadeInUp}
          className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          {body}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
