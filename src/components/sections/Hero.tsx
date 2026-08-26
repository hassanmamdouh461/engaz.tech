"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { MarkedText } from "@/components/ui/MarkedText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { Tape } from "@/components/ui/Tape";
import { BrandMark } from "@/components/ui/BrandMark";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";
import { backOut, fadeInUp, staggerContainer } from "@/lib/motion";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";

const { hero, partners } = content;

/** Small decorative tiles that idle around the mark, each on its own rhythm. */
const DECO = [
  {
    id: "code",
    className: "-left-10 -top-8 animate-float-slow bg-brand-cyan",
    glyph: "</>",
  },
  {
    id: "ai",
    className: "-right-8 top-1/4 animate-bounce-gentle bg-brand-yellow",
    glyph: "AI",
  },
  {
    id: "pos",
    className: "-left-12 bottom-6 animate-pop-out bg-brand-pink",
    glyph: "POS",
  },
] as const;

export function Hero() {
  const { t, locale } = useLocale();
  const scrollToAnchor = useAnchorScroll();

  return (
    <section id="home" className="relative px-4 pb-10 pt-8 sm:px-8 sm:pb-14 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
        >
          <div className="flex flex-col gap-5 sm:gap-6">
            <motion.p
              variants={fadeInUp}
              className="font-mono text-xl font-bold text-ink sm:text-2xl"
            >
              {/* Keyed on locale so the resolve replays in the new language. */}
              <ScrambleText key={locale} text={t(hero.greeting)} />
            </motion.p>

            <motion.h1 variants={fadeInUp} className="neo-h1 max-w-2xl">
              {t(hero.headlineLead)}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{t(hero.headlineAccent)}</span>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                  className="absolute -inset-x-1 bottom-1 top-[55%] -z-0 origin-left bg-brand-yellow"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg"
            >
              <MarkedText text={t(hero.subtitle)} />
            </motion.p>

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

          {/* The mark in a taped frame, standing in for the portfolio photo. */}
          <motion.div
            variants={fadeInUp}
            className="relative mx-auto hidden w-fit lg:block"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: -3 }}
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.35, ease: backOut }}
              className="relative flex h-[340px] w-[340px] origin-top-right items-center justify-center border-3 border-edge bg-brand-mint shadow-neo-8 xl:h-[400px] xl:w-[400px]"
            >
              <BrandMark className="h-40 w-40 text-black xl:h-48 xl:w-48" />
              <Tape className="-top-4 end-10 h-10 w-24 rotate-[15deg]" />
            </motion.div>

            {DECO.map((deco) => (
              <span
                key={deco.id}
                aria-hidden
                className={`absolute flex h-20 w-20 items-center justify-center border-3 border-edge font-mono text-base font-bold text-black drop-shadow-neo-5 ${deco.className}`}
              >
                {deco.glyph}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Stack rather than tech names: these are the things a visitor is shopping for. */}
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap justify-center gap-2 sm:mt-14 sm:gap-3"
        >
          {partners.tracks[0].items.slice(0, 8).map((item) => (
            <motion.li key={item.en} variants={fadeInUp}>
              <span className="neo-tag !py-2 text-xs sm:text-sm">{t(item)}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="mt-10 border-y-3 border-edge bg-brand-cyan py-3 sm:mt-14">
        <Marquee
          itemClassName="px-4 sm:px-6"
          items={hero.ticker.map((item) => (
            <span
              key={item.en}
              className="flex items-center gap-5 whitespace-nowrap text-lg font-bold uppercase tracking-tight text-black sm:gap-10 sm:text-3xl"
            >
              {t(item)}
              <span className="h-2.5 w-2.5 rotate-45 border-2 border-black bg-white" />
            </span>
          ))}
        />
      </div>
    </section>
  );
}
