"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";

const { brand } = content;

const SESSION_KEY = "engaz.introSeen";

/**
 * Each of the three glyph strokes flies in from its own direction and settles into
 * place, so the mark reads as being assembled rather than faded in.
 */
const piece = (fromX: number, fromY: number, rotate: number): Variants => ({
  hidden: { opacity: 0, x: fromX, y: fromY, rotate, scale: 0.55 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
});

const leftChevron = piece(-140, -40, -35);
const rightChevron = piece(140, -40, 35);
const checkStroke = piece(0, 120, 20);

export function IntroScreen() {
  const { t } = useLocale();
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || window.sessionStorage.getItem(SESSION_KEY) === "1") {
      return;
    }

    setVisible(true);
    window.sessionStorage.setItem(SESSION_KEY, "1");

    const timer = window.setTimeout(() => setVisible(false), 3100);
    return () => window.clearTimeout(timer);
  }, []);

  // Lenis owns the scroll, so body overflow alone leaves the page scrollable on touch.
  useEffect(() => {
    if (visible) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [visible, lenis]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="presentation"
          // Scales up and clears as it fades, so the site appears to emerge from behind it.
          exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.75, ease: [0.7, 0, 0.84, 0] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-950 px-6"
        >
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.5, 0.3], scale: [0.6, 1.2, 1] }}
            transition={{ duration: 2.4, ease: "easeOut" }}
            className="absolute h-64 w-64 rounded-full bg-blue-500/25 blur-[90px] sm:h-80 sm:w-80"
          />

          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.16, delayChildren: 0.1 }}
            className="relative"
          >
            <svg
              aria-hidden
              viewBox="0 0 32 32"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-20 w-20 drop-shadow-[0_0_30px_rgba(59,130,246,0.55)] sm:h-36 sm:w-36"
            >
              <motion.path d="M9 9 L4 16 L9 23" variants={leftChevron} />
              <motion.path d="M23 9 L28 16 L23 23" variants={rightChevron} />
              <motion.path d="M12.5 16.5 L15.5 19.5 L20 12" variants={checkStroke} stroke="#3b82f6" />
            </svg>

            {/* Flash on assembly: a brief bloom the instant the pieces meet. */}
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.4, 1.5, 1.9] }}
              transition={{ delay: 1.15, duration: 0.9, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-full bg-blue-400/30 blur-2xl"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: "easeOut" }}
            className="relative mt-6 text-2xl font-extrabold tracking-tight text-white sm:mt-8 sm:text-4xl"
          >
            {t(brand.name)}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.55, duration: 0.7 }}
            className="relative mt-3 text-center text-sm text-slate-400 sm:text-base"
          >
            {t(brand.tagline)}
          </motion.p>

          <motion.span
            aria-hidden
            initial={{ width: 0 }}
            animate={{ width: "7rem" }}
            transition={{ delay: 1.4, duration: 1.5, ease: "easeInOut" }}
            className="relative mt-10 h-0.5 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
