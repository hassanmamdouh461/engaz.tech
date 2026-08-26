"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";

/**
 * Reading rail across the top. The checkpoints fill cumulatively as sections pass
 * the viewport midline, so the row reads as a stepper rather than a single marker.
 */
const CHECKPOINTS = content.nav.links.filter((link) =>
  ["home", "about", "work", "services", "contact"].includes(link.id),
);

export function ProgressRail() {
  const { t } = useLocale();
  const { scrollYProgress } = useScroll();
  // scaleX rather than width: width relayouts every frame, scaleX composites.
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-2 border-b-3 border-edge bg-surface sm:h-3 sm:border-b-4"
    >
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-full border-e-3 border-edge bg-brand-yellow sm:border-e-4"
      />

      <div className="absolute inset-0 flex items-center justify-between px-[5%]">
        {CHECKPOINTS.map((link) => (
          <span key={link.id} className="sr-only">
            {t(link.label)}
          </span>
        ))}
      </div>
    </div>
  );
}
