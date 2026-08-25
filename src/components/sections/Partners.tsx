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

      <div className="mt-14 flex flex-col gap-12">
        {partners.tracks.map((track) => (
          <motion.div
            key={track.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-4">
              <h3 className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t(track.title)}
              </h3>
              {/* Rule fills the remaining width so the label reads as a section marker. */}
              <span className="h-px flex-1 bg-gradient-to-r from-slate-700/70 to-transparent" />
            </div>

            <Marquee
              direction={track.direction}
              pauseOnHover
              items={track.items.map((item) => (
                <span
                  key={item.en}
                  className="flex h-12 items-center whitespace-nowrap rounded-full border border-slate-700/50 bg-slate-800/30 px-5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:border-blue-400/60 hover:bg-slate-800/60 hover:text-white"
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
