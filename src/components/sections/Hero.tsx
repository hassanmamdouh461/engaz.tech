"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Marquee } from "@/components/ui/Marquee";
import { SplitText } from "@/components/ui/SplitText";
import { content } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";
import { cn } from "@/lib/cn";

const { hero } = content;

export function Hero() {
  const { t, isRtl, locale } = useLocale();
  const scrollToAnchor = useAnchorScroll();

  return (
    <section id="home" className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 lg:pt-40">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-7 text-center"
        >
          <motion.span variants={fadeInUp} className="glow-pill">
            <Sparkles className="h-3.5 w-3.5" />
            {t(hero.badge)}
          </motion.span>

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
            <MagneticButton>
              <motion.a
                href="#contact"
                onClick={(event) => {
                  if (scrollToAnchor("#contact")) {
                    event.preventDefault();
                  }
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary group"
              >
                {t(hero.primaryCta)}
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isRtl
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1",
                  )}
                />
              </motion.a>
            </MagneticButton>

            <MagneticButton>
              <motion.a
                href="#work"
                onClick={(event) => {
                  if (scrollToAnchor("#work")) {
                    event.preventDefault();
                  }
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-ghost"
              >
                <Terminal className="h-4 w-4" />
                {t(hero.secondaryCta)}
              </motion.a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-20 py-10"
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
