"use client";

import { motion } from "framer-motion";
import { ScrollStack } from "@/components/ui/ScrollStack";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { cardHover, fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { work } = content;

export function ProjectsGrid() {
  const { t } = useLocale();

  return (
    <Section id="work">
      <SectionHeading
        eyebrow={t(work.eyebrow)}
        heading={t(work.heading)}
        body={t(work.body)}
      />

      <ScrollStack
        className="mt-12"
        items={work.featured}
        itemKey={(project) => project.id}
        renderItem={(project) => {
          const Icon = resolveIcon(project.icon);
          return (
            <>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg sm:h-14 sm:w-14">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>

              <h3 className="mt-6 max-w-3xl text-2xl font-bold leading-tight text-white sm:mt-8 sm:text-4xl lg:text-5xl">
                {t(project.title)}
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:mt-5 sm:text-base">
                {t(project.description)}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-slate-700/50 pt-6 sm:mt-8 sm:grid-cols-3 sm:gap-6 sm:pt-8">
                {project.metrics.map((metric) => (
                  // column-reverse keeps dt before dd in the DOM, as the spec
                  // requires, while the figure still reads above its label.
                  <div key={metric.id} className="flex flex-col-reverse">
                    <dt className="mt-1 text-xs text-slate-400 sm:text-sm">
                      {t(metric.label)}
                    </dt>
                    <dd className="text-xl font-bold text-blue-400 sm:text-3xl">
                      {t(metric.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          );
        }}
      />

      <motion.h3
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 text-center text-lg font-semibold text-white sm:mt-16 sm:text-xl"
      >
        {t(work.secondaryHeading)}
      </motion.h3>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {work.secondary.map((project) => {
          const Icon = resolveIcon(project.icon);
          return (
            <motion.li
              key={project.id}
              variants={fadeInUp}
              whileHover={cardHover}
              className="glass-surface p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 sm:mt-0.5">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-base font-semibold text-white">{t(project.title)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {t(project.description)}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag.en}
                        className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-200"
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
