"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { markIntroDone } from "@/lib/intro-state";
import { useLocale } from "@/lib/locale-context";
import { backOut } from "@/lib/motion";

const { brand } = content;

/** The two glyph tiles that pop in, coloured like the accent pair. */
const TILES = [
  { char: "E", charAr: "إ", className: "bg-brand-cyan", delay: 0.1 },
  { char: "Z", charAr: "ز", className: "bg-brand-pink", delay: 0.2 },
];

/**
 * Entry curtain. Two brand tiles snap in, a progress bar fills, and the sheet
 * clears — the same beats as the reference loader, kept short enough that it does
 * not delay the largest contentful paint.
 */
export function Loader() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      markIntroDone();
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
      markIntroDone();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="presentation"
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-brand-yellow px-4 xs:gap-7 sm:gap-8 sm:px-6"
        >
          {/* Floating deco squares, mirroring the tile geometry at a smaller scale. */}
          {[
            { className: "start-[8%] top-[14%] bg-brand-cyan", delay: "0s" },
            { className: "end-[10%] top-[20%] bg-brand-mint", delay: "0.5s" },
            { className: "bottom-[18%] start-[12%] bg-brand-pink", delay: "1s" },
          ].map((shape) => (
            <span
              key={shape.className}
              aria-hidden
              style={{ animationDelay: shape.delay }}
              className={`absolute h-9 w-9 animate-float-deco border-3 border-black xs:h-12 xs:w-12 sm:h-20 sm:w-20 ${shape.className}`}
            />
          ))}

          <div className="relative flex items-center gap-2.5 xs:gap-3 sm:gap-4">
            {TILES.map((tile) => (
              <motion.span
                key={tile.char}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: tile.delay, ease: backOut }}
                className={`flex h-[70px] w-[70px] items-center justify-center border-3 border-black text-4xl font-bold text-black shadow-[6px_6px_0_#000] xs:h-[90px] xs:w-[90px] xs:border-4 xs:text-5xl xs:shadow-[8px_8px_0_#000] sm:h-[120px] sm:w-[120px] sm:border-6 sm:text-[6rem] sm:shadow-[12px_12px_0_#000] ${tile.className}`}
              >
                {locale === "ar" ? tile.charAr : tile.char}
              </motion.span>
            ))}
          </div>

          <p className="relative text-center text-lg font-bold text-black xs:text-xl sm:text-2xl">
            {brand.name[locale]}
            <span className="mt-1 block text-xs font-semibold xs:text-sm sm:text-base">
              {brand.tagline[locale]}
            </span>
          </p>

          <div className="relative h-3.5 w-[180px] overflow-hidden border-3 border-black bg-white shadow-[4px_4px_0_#000] xs:h-4 xs:w-[220px] xs:border-4 xs:shadow-[6px_6px_0_#000] sm:h-5 sm:w-[300px]">
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              // The trailing black edge reads as the leading edge of a filled bar.
              className="block h-full border-e-4 border-black bg-brand-cyan"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
