"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { pillars } = content;

export function Pillars() {
  const { t } = useLocale();

  return (
    <Section id="about">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <SectionHeading
          eyebrow={t(pillars.eyebrow)}
          heading={t(pillars.heading)}
          body={t(pillars.body)}
        />
      </motion.div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {pillars.items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <motion.li key={item.id} variants={fadeInUp}>
              <TiltCard className="h-full">
                <SpotlightCard className="glass-surface h-full p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{t(item.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(item.body)}</p>
                </SpotlightCard>
              </TiltCard>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
