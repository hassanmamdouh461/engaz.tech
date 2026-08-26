"use client";

import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { fadeInUp, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { partners } = content;

const TRACK_TONE = ["bg-brand-yellow", "bg-brand-cyan"] as const;

export function Partners() {
  const { t } = useLocale();

  return (
    <Section id="partners">
      <SectionHeading
        eyebrow={t(partners.eyebrow)}
        heading={t(partners.heading)}
        accent="mint"
      />

      <div className="mt-10 flex flex-col gap-8 sm:mt-14 sm:gap-10">
        {partners.tracks.map((track, index) => (
          <motion.div
            key={track.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="border-3 border-edge bg-surface shadow-neo-6"
          >
            <h3 className="border-b-3 border-edge px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink">
              {t(track.title)}
            </h3>

            {/* Each track is a band of oversized names crossing the card, with a
                diamond between them, so the stack reads at a glance. */}
            <div className={`py-3 ${TRACK_TONE[index % TRACK_TONE.length]}`}>
              <Marquee
                direction={track.direction}
                pauseOnHover
                items={track.items.map((item) => (
                  <span
                    key={item.en}
                    className="flex items-center gap-5 whitespace-nowrap text-lg font-bold uppercase tracking-tight text-black sm:gap-8 sm:text-2xl"
                  >
                    {t(item)}
                    <span className="h-2 w-2 rotate-45 border-2 border-black bg-white" />
                  </span>
                ))}
                itemClassName="px-3 sm:px-4"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
