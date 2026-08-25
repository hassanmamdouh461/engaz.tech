"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { cardHover, fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";
import type { FeaturedProject } from "@/lib/types";

const { work } = content;

interface StackCardProps {
  project: FeaturedProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

/**
 * One card in the scroll stack. Sticks below the header while later cards slide over it,
 * shrinking so the buried cards read as a receding pile with their top edge still visible.
 */
function StackCard({ project, index, total, progress }: StackCardProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const Icon = resolveIcon(project.icon);

  // Cards deeper in the pile shrink more; the last card stays at full size.
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div
      className="sticky top-0 flex h-[100svh] items-start justify-center"
      style={{ paddingTop: `calc(6.5rem + ${index * 1.5}rem)` }}
    >
      <motion.article
        style={reduceMotion ? undefined : { scale }}
        className="w-full origin-top overflow-hidden rounded-[2rem] border border-slate-700/50 bg-gradient-to-br from-slate-900/95 via-base-900/95 to-base-950/95 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg">
          <Icon className="h-7 w-7" />
        </span>

        <h3 className="mt-8 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {t(project.title)}
        </h3>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          {t(project.description)}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-slate-700/50 pt-8 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.id}>
              <dt className="sr-only">{t(metric.label)}</dt>
              <dd className="text-2xl font-bold text-blue-400 sm:text-3xl">
                {t(metric.value)}
              </dd>
              <p className="mt-1 text-sm text-slate-500">{t(metric.label)}</p>
            </div>
          ))}
        </dl>
      </motion.article>
    </div>
  );
}

function FeaturedStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="mt-12">
      {work.featured.map((project, index) => (
        <StackCard
          key={project.id}
          project={project}
          index={index}
          total={work.featured.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export function ProjectsGrid() {
  const { t } = useLocale();

  return (
    <Section id="work">
      <SectionHeading
        eyebrow={t(work.eyebrow)}
        heading={t(work.heading)}
        body={t(work.body)}
        align="start"
      />

      <FeaturedStack />

      <motion.h3
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-16 text-center text-lg font-semibold text-white sm:text-xl"
      >
        {t(work.secondaryHeading)}
      </motion.h3>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {work.secondary.map((project) => {
          const Icon = resolveIcon(project.icon);
          return (
            <motion.li
              key={project.id}
              variants={fadeInUp}
              whileHover={cardHover}
              className="glass-surface p-6"
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-base font-semibold text-white">{t(project.title)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {t(project.description)}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag.en}
                        className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[0.7rem] text-blue-200"
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
