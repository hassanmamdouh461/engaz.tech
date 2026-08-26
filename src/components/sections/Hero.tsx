"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { SplitText } from "@/components/ui/SplitText";
import { content } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";

const { hero } = content;

export function Hero() {
  const { t, locale } = useLocale();
  const scrollToAnchor = useAnchorScroll();

  return (
    <section id="home" className="relative">
      {/* Fills the viewport so the ticker below starts off-screen on first paint. */}
      <div className="flex min-h-svh flex-col justify-center px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28">
        <div className="mx-auto w-full max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 text-center sm:gap-7"
        >
          {/* Keyed on locale so the reveal replays with the new text instead of swapping mid-flight.
              The split words are aria-hidden, so the label carries the whole headline as one
              sentence for assistive tech and for anything reading the accessible name. */}
          <motion.h1
            key={locale}
            variants={staggerContainer}
            aria-label={`${t(hero.headlineLead)} ${t(hero.headlineAccent)}`}
            className="max-w-4xl text-balance text-[2rem] font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl"
          >
            <SplitText text={t(hero.headlineLead)} />
            <SplitText text={t(hero.headlineAccent)} className="gradient-text" delay={0.12} />
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            {t(hero.subtitle)}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
          >
            <motion.a
              href="#contact"
              onClick={(event) => {
                if (scrollToAnchor("#contact")) {
                  event.preventDefault();
                }
              }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary group"
            >
              {t(hero.primaryCta)}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="#work"
              onClick={(event) => {
                if (scrollToAnchor("#work")) {
                  event.preventDefault();
                }
              }}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost"
            >
              <Terminal className="h-4 w-4" />
              {t(hero.secondaryCta)}
            </motion.a>
          </motion.div>
        </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="pb-16"
      >
        <Marquee
          itemClassName="px-4 sm:px-6"
          items={hero.ticker.map((item) => (
            <span
              key={item.en}
              className="flex items-center gap-6 whitespace-nowrap text-xl font-bold tracking-tight text-slate-400/70 sm:gap-12 sm:text-4xl"
            >
              {t(item)}
              {/* Rotated square reads as the small diamond separator between phrases. */}
              <span className="h-1.5 w-1.5 rotate-45 bg-blue-500" />
            </span>
          ))}
        />
      </motion.div>
    </section>
  );
}
