"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { fadeInUp, scaleUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { stats } = content;

export function Stats() {
  const { t } = useLocale();

  return (
    <Section id="impact">
      <SectionHeading eyebrow={t(stats.eyebrow)} heading={t(stats.heading)} />

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.cards.map((card) => (
          <motion.li
            key={card.id}
            variants={scaleUp}
            className="glass-card relative overflow-hidden p-7 text-center"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-neon/60 to-transparent" />
            <p className="gradient-text text-4xl font-extrabold sm:text-5xl">
              <CountUp value={card.value} prefix={card.prefix} suffix={card.suffix} />
            </p>
            <p className="mt-3 text-sm text-slate-400">{t(card.label)}</p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-5 grid gap-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 backdrop-blur-md sm:grid-cols-3"
      >
        {stats.miniStats.map((item) => (
          <motion.li key={item.id} variants={fadeInUp} className="text-center">
            <p className="text-2xl font-bold text-white">{t(item.value)}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
              {t(item.label)}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
