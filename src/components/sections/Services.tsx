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
import { useLocale } from "@/lib/locale-context";
import type { Service } from "@/lib/types";

const { services } = content;

interface StackCardProps {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

/**
 * One service card in the scroll stack. Sticks while later cards slide over it and
 * shrink, so the buried cards read as a receding pile with their top edge visible.
 */
function StackCard({ service, index, total, progress }: StackCardProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const Icon = resolveIcon(service.icon);

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
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg">
            <Icon className="h-7 w-7" />
          </span>
          <span className="text-sm font-medium uppercase tracking-wider text-blue-400">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-8 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          {t(service.title)}
        </h3>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          {t(service.body)}
        </p>
      </motion.article>
    </div>
  );
}

export function Services() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <Section id="services">
      <SectionHeading
        eyebrow={t(services.eyebrow)}
        heading={t(services.heading)}
        body={t(services.body)}
      />

      <div ref={containerRef} className="mt-14">
        {services.items.map((service, index) => (
          <StackCard
            key={service.id}
            service={service}
            index={index}
            total={services.items.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </Section>
  );
}
