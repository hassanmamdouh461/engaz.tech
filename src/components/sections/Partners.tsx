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

      <div className="mt-10 flex flex-col gap-10 sm:mt-14 sm:gap-14">
        {partners.tracks.map((track) => (
          <motion.div
            key={track.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:whitespace-nowrap sm:tracking-[0.2em]">
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
                  className="flex items-center gap-6 whitespace-nowrap text-xl font-bold tracking-tight text-slate-400/70 transition-colors duration-200 hover:text-slate-200 sm:gap-8 sm:text-3xl"
                >
                  {t(item)}
                  <span className="h-1.5 w-1.5 rotate-45 bg-blue-500" />
                </span>
              ))}
              itemClassName="px-3 sm:px-4"
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
