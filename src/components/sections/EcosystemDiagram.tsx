"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { dropIn, press, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";
import { cn } from "@/lib/cn";

const { ecosystem } = content;

const TONES = ["bg-brand-cyan", "bg-brand-yellow", "bg-brand-pink", "bg-brand-mint"] as const;

export function EcosystemDiagram() {
  const { t } = useLocale();

  return (
    <Section id="ecosystem">
      <SectionHeading
        eyebrow={t(ecosystem.eyebrow)}
        heading={t(ecosystem.heading)}
        body={t(ecosystem.body)}
        accent="cyan"
      />

      {/* Numbered steps on a drawn rail: the sequence is the point, so the number
          leads and the rail carries the eye from one to the next. */}
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
      >
        {ecosystem.stages.map((stage, index) => {
          const Icon = resolveIcon(stage.icon);
          const tone = TONES[index % TONES.length];

          return (
            <motion.li
              key={stage.id}
              variants={dropIn(index % 2 === 0 ? -1.5 : 1.5)}
              whileHover={press(6)}
              className="relative flex h-full flex-col border-3 border-edge bg-surface p-4 shadow-neo-4 xs:p-5 sm:shadow-neo-6"
            >
              {/* The step number sits half outside the card, so the order is legible
                  before any of the copy is read. */}
              <span
                dir="ltr"
                className={cn(
                  "absolute -top-5 start-4 flex h-9 w-9 items-center justify-center border-3 border-edge font-mono text-sm font-bold text-black shadow-neo-2 sm:h-10 sm:w-10 sm:text-base",
                  tone,
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <Icon aria-hidden className="mt-5 h-8 w-8 text-ink sm:mt-6 sm:h-9 sm:w-9" />

              <h3 className="mt-3 text-sm font-bold uppercase tracking-[-0.5px] text-ink xs:text-base sm:text-lg">
                {t(stage.title)}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-ink/80">{t(stage.body)}</p>

              <ul className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                {stage.nodes.map((node) => (
                  <li
                    key={node.en}
                    className="border-2 border-edge bg-page px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold text-ink sm:px-2 sm:text-[0.7rem]"
                  >
                    {t(node)}
                  </li>
                ))}
              </ul>
            </motion.li>
          );
        })}
      </motion.ol>
    </Section>
  );
}
