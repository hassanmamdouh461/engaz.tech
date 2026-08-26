"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { MarkedText } from "@/components/ui/MarkedText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { Tape } from "@/components/ui/Tape";
import { BrandMark } from "@/components/ui/BrandMark";
import { content } from "@/lib/content";
import { useIntroDone } from "@/lib/intro-state";
import { useLocale } from "@/lib/locale-context";
import { backOut, fadeInUp, staggerContainer } from "@/lib/motion";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";

const { hero, partners } = content;

/**
 * Decorative tiles that idle around the mark, each on its own rhythm. They sit
 * outside the frame, so they only appear where there is room beside it.
 */
const DECO = [
  {
    id: "code",
    className: "-start-8 -top-6 animate-float-slow bg-brand-cyan xl:-start-10 xl:-top-8",
    glyph: "</>",
  },
  {
    id: "ai",
    className: "-end-6 top-1/4 animate-bounce-gentle bg-brand-yellow xl:-end-8",
    glyph: "AI",
  },
  {
    id: "pos",
    className: "-start-9 bottom-5 animate-pop-out bg-brand-pink xl:-start-12 xl:bottom-6",
    glyph: "POS",
  },
] as const;

export function Hero() {
  const { t, locale } = useLocale();
  const scrollToAnchor = useAnchorScroll();
  // The entry curtain covers the screen for the first moment, so the decorative
  // reveals wait for it to clear rather than playing behind it. The copy itself is
  // never gated: hiding it at first paint leaves nothing contentful to measure.
  const ready = useIntroDone();

  return (
    <section id="home" className="relative px-3 pb-8 pt-6 sm:px-6 sm:pb-12 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial={false}
          animate="visible"
          className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            <p className="font-mono text-base font-bold text-ink xs:text-lg sm:text-2xl">
              {/* Keyed on locale so the resolve replays in the new language. */}
              {ready ? (
                <ScrambleText key={locale} text={t(hero.greeting)} delay={120} />
              ) : (
                t(hero.greeting)
              )}
            </p>

            <h1 className="neo-h1 max-w-2xl">
              {t(hero.headlineLead)}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{t(hero.headlineAccent)}</span>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: ready ? 1 : 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                  className="absolute -inset-x-1 bottom-1 top-[55%] -z-0 origin-left bg-brand-yellow"
                />
              </span>
            </h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-xl text-sm leading-relaxed text-ink/80 xs:text-base sm:text-lg"
            >
              <MarkedText text={t(hero.subtitle)} />
            </motion.p>

            {/* Full-width stacked buttons below sm: two 44px targets side by side
                do not fit a 360px column without the labels wrapping. */}
            <motion.div
              variants={fadeInUp}
              className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
              <a
                href="#contact"
                onClick={(event) => {
                  if (scrollToAnchor("#contact")) event.preventDefault();
                }}
                className="neo-btn-primary group"
              >
                {t(hero.primaryCta)}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
              </a>

              <a
                href="#work"
                onClick={(event) => {
                  if (scrollToAnchor("#work")) event.preventDefault();
                }}
                className="neo-btn-surface"
              >
                <Terminal className="h-4 w-4" />
                {t(hero.secondaryCta)}
              </a>
            </motion.div>
          </div>

          {/* The mark in a taped frame, standing in for the portfolio photo. Shown
              from md up: on a phone it would push the copy a full screen down. */}
          <motion.div
            variants={fadeInUp}
            className="relative mx-auto hidden w-fit md:block"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: -3 }}
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.35, ease: backOut }}
              className="relative flex h-[260px] w-[260px] origin-top-right items-center justify-center border-3 border-edge bg-brand-mint shadow-neo-8 lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
            >
              <BrandMark className="h-28 w-28 text-black lg:h-36 lg:w-36 xl:h-48 xl:w-48" />
              <Tape className="-top-3 end-8 h-8 w-20 rotate-[15deg] lg:-top-4 lg:end-10 lg:h-10 lg:w-24" />
            </motion.div>

            {DECO.map((deco) => (
              <span
                key={deco.id}
                aria-hidden
                className={`absolute flex h-14 w-14 items-center justify-center border-3 border-edge font-mono text-xs font-bold text-black drop-shadow-neo-5 lg:h-20 lg:w-20 lg:text-base ${deco.className}`}
              >
                {deco.glyph}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Stack rather than tech names: these are the things a visitor is shopping for.
            Four chips on a phone, all eight once there is room for them to read. */}
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-12 sm:gap-3"
        >
          {partners.tracks[0].items.slice(0, 8).map((item, index) => (
            <motion.li
              key={item.en}
              variants={fadeInUp}
              className={index >= 4 ? "hidden sm:block" : undefined}
            >
              <span className="neo-tag">{t(item)}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="mt-8 border-y-3 border-edge bg-brand-cyan py-2.5 sm:mt-12 sm:py-3">
        <Marquee
          itemClassName="px-3 sm:px-6"
          items={hero.ticker.map((item) => (
            <span
              key={item.en}
              className="flex items-center gap-4 whitespace-nowrap text-sm font-bold uppercase tracking-tight text-black xs:text-base sm:gap-10 sm:text-2xl lg:text-3xl"
            >
              {t(item)}
              <span className="h-2 w-2 rotate-45 border-2 border-black bg-white sm:h-2.5 sm:w-2.5" />
            </span>
          ))}
        />
      </div>
    </section>
  );
}
