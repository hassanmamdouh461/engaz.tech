"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { scaleUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { services } = content;

export function Services() {
  const { t } = useLocale();

  return (
    <Section id="services">
      <SectionHeading
        eyebrow={t(services.eyebrow)}
        heading={t(services.heading)}
        body={t(services.body)}
      />

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.items.map((service) => {
          const Icon = resolveIcon(service.icon);
          return (
            <motion.li key={service.id} variants={scaleUp}>
              <SpotlightCard className="glass-surface h-full p-7">
                <motion.span
                  whileHover={{ rotate: -8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-base-900/70 text-cyan-300"
                >
                  <Icon className="h-5 w-5" />
                </motion.span>
                <h3 className="mt-5 text-base font-semibold text-white">{t(service.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(service.body)}</p>
              </SpotlightCard>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
