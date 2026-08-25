"use client";

import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function CountUp({ value, prefix = "", suffix = "", duration = 1.8 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const count = useMotionValue(0);
  const formatted = useTransform(
    count,
    (latest) => `${prefix}${Math.round(latest).toLocaleString("en-US")}${suffix}`,
  );

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls = animate(count, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, value, duration, count]);

  return (
    <span ref={ref} dir="ltr" className="inline-block tabular-nums">
      {/* The animated value starts at zero, so expose the real figure to assistive tech and crawlers. */}
      <span className="sr-only">{`${prefix}${value.toLocaleString("en-US")}${suffix}`}</span>
      <motion.span aria-hidden>{formatted}</motion.span>
    </span>
  );
}
