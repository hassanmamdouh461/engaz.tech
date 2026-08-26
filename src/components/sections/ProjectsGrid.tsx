"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tape } from "@/components/ui/Tape";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { dropIn, fadeInUp, press, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";
import { cn } from "@/lib/cn";

const { work } = content;

const FEATURED_TONE = ["bg-brand-cyan", "bg-brand-yellow", "bg-brand-mint"] as const;

export function ProjectsGrid() {
  const { t } = useLocale();

  return (
    <Section id="work">
      <SectionHeading
        eyebrow={t(work.eyebrow)}
        heading={t(work.heading)}
        body={t(work.body)}
        accent="yellow"
      />

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-8 flex flex-col gap-5 sm:mt-12 sm:gap-8"
      >
        {work.featured.map((project, index) => {
          const Icon = resolveIcon(project.icon);
          return (
            <motion.li
              key={project.id}
              variants={dropIn(index % 2 === 0 ? -1 : 1)}
              whileHover={press(6)}
              className="relative border-3 border-edge bg-surface p-4 shadow-neo-4 xs:p-5 sm:border-4 sm:p-8 sm:shadow-neo-8 lg:p-10"
            >
              <Tape className="-top-3 end-5 h-7 w-20 rotate-[12deg] sm:-top-4 sm:end-8 sm:h-9 sm:w-24" />

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center border-3 border-edge text-black shadow-neo-3 sm:h-14 sm:w-14",
                    FEATURED_TONE[index % FEATURED_TONE.length],
                  )}
                >
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                </span>
                <span className="neo-badge bg-surface !px-2.5 !py-1.5 !text-xs text-ink sm:!px-4 sm:!py-2 sm:!text-sm">
                  {t(project.sector)}
                </span>
              </div>

              <h3 className="mt-4 max-w-3xl text-lg font-bold uppercase leading-tight tracking-[-0.5px] text-ink xs:text-xl sm:mt-8 sm:text-3xl lg:text-4xl">
                {t(project.title)}
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80 sm:mt-4 sm:text-base">
                {t(project.description)}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t-3 border-edge pt-5 xs:gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6 sm:border-t-4">
                {project.metrics.map((metric) => (
                  // column-reverse keeps dt before dd in the DOM, as the spec requires,
                  // while the figure still reads above its label.
                  <div key={metric.id} className="flex flex-col-reverse">
                    <dt className="mt-1 font-mono text-[0.7rem] text-ink/70 sm:text-sm">
                      {t(metric.label)}
                    </dt>
                    <dd className="text-xl font-bold text-ink xs:text-2xl sm:text-3xl">
                      {t(metric.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.li>
          );
        })}
      </motion.ul>

      <motion.h3
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="neo-h3 mt-10 sm:mt-14"
      >
        {t(work.secondaryHeading)}
      </motion.h3>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-5 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
      >
        {work.secondary.map((project, index) => {
          const Icon = resolveIcon(project.icon);
          return (
            <motion.li
              key={project.id}
              variants={dropIn(index % 2 === 0 ? -1 : 1)}
              whileHover={press(4)}
              className="border-3 border-edge bg-surface p-4 shadow-neo-4 xs:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border-3 border-edge bg-brand-pink text-black">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-ink">{t(project.title)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">
                    {t(project.description)}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag.en}
                        className="border-2 border-edge bg-brand-mint px-2 py-0.5 font-mono text-xs font-semibold text-black"
                      >
                        {t(tag)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
