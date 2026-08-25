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
      <div className="flex min-h-svh flex-col justify-center px-5 pb-20 pt-28 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-7 text-center"
        >
          {/* Keyed on locale so the reveal replays with the new text instead of swapping mid-flight. */}
          <motion.h1
            key={locale}
            variants={staggerContainer}
            className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl"
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
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span>
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
            </span>

            <span>
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
            </span>
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
          itemClassName="px-6"
          items={hero.ticker.map((item) => (
            <span
              key={item.en}
              className="flex items-center gap-12 whitespace-nowrap text-3xl font-bold tracking-tight text-slate-500/50 sm:text-4xl"
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
