"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { cardHover, fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { work } = content;

export function ProjectsGrid() {
  const { t, locale } = useLocale();
  const [activeSector, setActiveSector] = useState<string>("all");

  const sectors = useMemo(() => {
    const seen = new Set<string>();
    for (const project of work.featured) {
      seen.add(project.sector.en);
    }
    return Array.from(seen);
  }, []);

  const sectorTabs = useMemo(
    () => [
      { id: "all", label: t({ en: "All Systems", ar: "كل الأنظمة" }) },
      ...sectors.map((sector) => {
        const source = work.featured.find((p) => p.sector.en === sector)!;
        return { id: sector, label: t(source.sector) };
      }),
    ],
    [sectors, t, locale],
  );

  const visibleProjects = useMemo(
    () =>
      activeSector === "all"
        ? work.featured
        : work.featured.filter((p) => p.sector.en === activeSector),
    [activeSector],
  );

  return (
    <Section id="work">
      <SectionHeading
        eyebrow={t(work.eyebrow)}
        heading={t(work.heading)}
        body={t(work.body)}
      />

      <div className="mt-10 flex justify-center">
        <SlidingTabs
          options={sectorTabs}
          activeId={activeSector}
          onChange={setActiveSector}
          layoutId="activeTab"
          ariaLabel={t({ en: "Filter showcase by sector", ar: "تصفية الأعمال حسب القطاع" })}
        />
      </div>

      <motion.ul
        key={activeSector}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-5 lg:grid-cols-3"
      >
        {visibleProjects.map((project) => {
          const Icon = resolveIcon(project.icon);
          return (
            <motion.li key={project.id} variants={fadeInUp}>
              <TiltCard className="h-full">
                <SpotlightCard className="group flex h-full flex-col p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 text-cyan-300 transition-colors group-hover:text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[0.7rem] text-slate-400">
                      {t(project.sector)}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold leading-snug text-white">
                    {t(project.title)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {t(project.description)}
                  </p>

                  <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-5">
                    {project.metrics.map((metric) => (
                      <div key={metric.id}>
                        <dt className="sr-only">{t(metric.label)}</dt>
                        <dd className="text-sm font-bold text-cyan-300">{t(metric.value)}</dd>
                        <p className="mt-1 text-[0.7rem] leading-tight text-slate-500">
                          {t(metric.label)}
                        </p>
                      </div>
                    ))}
                  </dl>
                </SpotlightCard>
              </TiltCard>
            </motion.li>
          );
        })}
      </motion.ul>

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
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-cyan-300">
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
                        className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[0.7rem] text-cyan-200"
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
