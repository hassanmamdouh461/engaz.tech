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
        className="mt-12 grid gap-5 sm:mt-20 sm:gap-6 md:grid-cols-2"
      >
        {pillars.items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <motion.li key={item.id} variants={fadeInUp}>
              <SpotlightCard className="glass-surface h-full !rounded-3xl p-6 sm:p-8">
                {/* Stacks below sm so the text is not squeezed into a ~190px column. */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white sm:text-xl">{t(item.title)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:mt-3 sm:text-base">
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
