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

      <div className="mt-14 flex flex-col gap-14">
        {partners.tracks.map((track) => (
          <motion.div
            key={track.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <h3 className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t(track.title)}
              </h3>
              {/* Rule fills the remaining width so the label reads as a section marker. */}
              <span className="h-px flex-1 bg-gradient-to-r from-slate-700/70 to-transparent" />
            </div>

            {/* Same treatment as the hero ticker: oversized low-contrast display text
                separated by small blue diamonds, no card chrome. */}
            <Marquee
              direction={track.direction}
              pauseOnHover
              items={track.items.map((item) => (
                <span
                  key={item.en}
                  className="flex items-center gap-8 whitespace-nowrap text-2xl font-bold tracking-tight text-slate-500/60 transition-colors duration-200 hover:text-slate-300 sm:text-3xl"
                >
                  {t(item)}
                  <span className="h-1.5 w-1.5 rotate-45 bg-blue-500" />
                </span>
              ))}
              itemClassName="px-4"
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
