"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

/**
 * Reading rail across the top. Purely decorative (aria-hidden): the page's own
 * headings and nav landmarks are what assistive tech navigates by.
 */
export function ProgressRail() {
  const { locale } = useLocale();
  const { scrollYProgress } = useScroll();
  // scaleX rather than width: width relayouts every frame, scaleX composites.
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-2 border-b-3 border-edge bg-surface sm:h-3 sm:border-b-4"
    >
      <motion.div
        style={{ scaleX, transformOrigin: locale === "ar" ? "right" : "left" }}
        className="h-full border-e-3 border-edge bg-brand-yellow sm:border-e-4"
      />
    </div>
  );
}
