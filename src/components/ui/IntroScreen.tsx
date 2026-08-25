"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";

const { brand } = content;

const SESSION_KEY = "engaz.introSeen";

/**
 * Brand intro overlay. Shows once per browser session so returning to the page
 * mid-visit doesn't replay it, and is skipped entirely for reduced-motion users.
 */
export function IntroScreen() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || window.sessionStorage.getItem(SESSION_KEY) === "1") {
      return;
    }

    setVisible(true);
    window.sessionStorage.setItem(SESSION_KEY, "1");

    // Lock scrolling while the overlay covers the page.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => setVisible(false), 2300);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="presentation"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-950"
        >
          {/* Soft glow behind the mark, breathing so the screen never looks frozen. */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.55, 0.35], scale: [0.7, 1.15, 1] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Image
              src="/logo-mark.png"
              alt=""
              width={143}
              height={148}
              priority
              className="h-28 w-auto drop-shadow-[0_0_35px_rgba(59,130,246,0.45)] sm:h-36"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
            className="relative mt-8 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            {t(brand.name)}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="relative mt-3 text-sm text-slate-400 sm:text-base"
          >
            {t(brand.tagline)}
          </motion.p>

          {/* Loading bar doubles as a hint that the overlay is about to clear. */}
          <motion.span
            aria-hidden
            initial={{ width: 0 }}
            animate={{ width: "7rem" }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
            className="relative mt-10 h-0.5 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
