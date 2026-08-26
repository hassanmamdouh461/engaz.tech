"use client";

import { motion } from "framer-motion";
import { NeoCard } from "@/components/ui/NeoCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { pillars } = content;

export function Pillars() {
  const { t } = useLocale();

  return (
    <Section id="about">
      <SectionHeading
        eyebrow={t(pillars.eyebrow)}
        heading={t(pillars.heading)}
        body={t(pillars.body)}
        accent="cyan"
      />

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:gap-8"
      >
        {pillars.items.map((item, index) => (
          <li key={item.id} className="h-full">
            <NeoCard
              index={index}
              icon={resolveIcon(item.icon)}
              title={t(item.title)}
              body={t(item.body)}
            />
          </li>
        ))}
      </motion.ul>
    </Section>
  );
}
