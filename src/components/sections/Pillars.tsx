"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { pillars } = content;

export function Pillars() {
  const { t } = useLocale();

  return (
    <Section id="about">
      <SectionHeading heading={t(pillars.heading)} body={t(pillars.body)} />

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-20 grid gap-6 md:grid-cols-2"
      >
        {pillars.items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <motion.li key={item.id} variants={fadeInUp}>
              <SpotlightCard className="glass-surface h-full !rounded-3xl p-8">
                <div className="flex items-start gap-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t(item.title)}</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-400">
                      {t(item.body)}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
