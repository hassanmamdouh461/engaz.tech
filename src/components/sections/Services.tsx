"use client";

import { motion } from "framer-motion";
import { NeoCard } from "@/components/ui/NeoCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { staggerContainer, viewportOnce } from "@/lib/motion";
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
        accent="pink"
      />

      {/* Six across three columns, with the last two widened so the row is not left ragged. */}
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-6 lg:gap-8"
      >
        {services.items.map((service, index) => (
          <li
            key={service.id}
            className={index >= 4 ? "h-full lg:col-span-3" : "h-full lg:col-span-2"}
          >
            <NeoCard
              index={index}
              icon={resolveIcon(service.icon)}
              title={t(service.title)}
              body={t(service.body)}
              filled={index >= 4}
              footer={
                <span className="neo-badge border-edge bg-surface text-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
              }
            />
          </li>
        ))}
      </motion.ul>
    </Section>
  );
}
