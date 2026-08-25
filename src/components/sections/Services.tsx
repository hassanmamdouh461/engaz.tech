"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { cardHover, fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
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
        className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
      >
        {services.items.map((service, index) => {
          const Icon = resolveIcon(service.icon);
          return (
            <motion.li key={service.id} variants={fadeInUp} whileHover={cardHover}>
              <SpotlightCard className="glass-surface h-full p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-medium tracking-wider text-blue-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-white">
                  {t(service.title)}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {t(service.body)}
                </p>
              </SpotlightCard>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
