"use client";

import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { fadeInUp, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { partners } = content;

export function Partners() {
  const { t } = useLocale();

  return (
    <Section id="partners">
      <SectionHeading eyebrow={t(partners.eyebrow)} heading={t(partners.heading)} />

      <div className="mt-14 flex flex-col gap-10">
        {partners.tracks.map((track) => (
          <motion.div
            key={track.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4"
          >
            <h3 className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {t(track.title)}
            </h3>
            <Marquee
              direction={track.direction}
              items={track.items.map((item) => (
                <span
                  key={item.en}
                  className="flex h-14 items-center whitespace-nowrap rounded-xl border border-slate-800/80 bg-slate-900/40 px-6 text-sm font-medium text-slate-300 backdrop-blur-md transition-colors hover:border-accent-neon/40 hover:text-white"
                >
                  {t(item)}
                </span>
              ))}
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
