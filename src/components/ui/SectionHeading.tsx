"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  body?: string;
  align?: "center" | "start";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  body,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className,
      )}
    >
      <motion.span
        variants={fadeInUp}
        className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeInUp}
        className="max-w-3xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[2.75rem]"
      >
        {heading}
      </motion.h2>
      {body ? (
        <motion.p
          variants={fadeInUp}
          className="max-w-2xl text-base leading-relaxed text-slate-400"
        >
          {body}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
