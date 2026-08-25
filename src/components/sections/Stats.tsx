"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { StatsBackdrop } from "@/components/ui/StatsBackdrop";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";

const { stats } = content;

/**
 * One counter panel. Each panel owns a slice of the section's scroll range: it fades
 * and lifts into place, holds while centred, then fades out as the next one arrives.
 * The map behind them stays fixed because the whole stage is `sticky`.
 */
function StatPanel({
  progress,
  index,
  total,
  caption,
  value,
  suffix,
  label,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  caption: string;
  value: number;
  suffix: string;
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  const slice = 1 / total;
  const start = index * slice;
  const enter = start + slice * 0.18;
  const exit = start + slice * 0.82;
  const end = start + slice;

  // The first panel is already visible on entry; the last one holds until the end.
  const opacity = useTransform(
    progress,
    [start, enter, exit, end],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0],
  );
  const y = useTransform(
    progress,
    [start, enter, exit, end],
    [index === 0 ? 0 : 40, 0, 0, index === total - 1 ? 0 : -40],
  );

  const counted = useTransform(progress, [start, enter], [0, value], {
    clamp: true,
  });
  const display = useTransform(counted, (latest) =>
    Math.round(latest).toLocaleString("en-US"),
  );

  // Reduced motion keeps the crossfade (it carries meaning: which counter is active)
  // but drops the vertical travel and the counting animation.
  return (
    <motion.div
      style={reduceMotion ? { opacity } : { opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center sm:px-6"
    >
      <p className="text-base font-bold text-blue-400 sm:text-xl">{caption}</p>

      <p className="mt-2 flex items-start justify-center text-white">
        <motion.span
          dir="ltr"
          className="text-[3.25rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-[6rem] lg:text-[9rem]"
        >
          {reduceMotion ? value.toLocaleString("en-US") : display}
        </motion.span>
        <span className="mt-1.5 text-xl font-bold sm:mt-5 sm:text-4xl">{suffix}</span>
      </p>

      <p className="mt-4 max-w-xs text-sm text-slate-400 sm:max-w-md sm:text-xl">{label}</p>
    </motion.div>
  );
}

export function Stats() {
  const { t } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  // Progress across the tall track drives which counter is on screen.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const cards = stats.cards;

  return (
    <section id="impact" className="relative">
      <div className="mx-auto w-full max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20 md:pt-28">
        <SectionHeading heading={t(stats.heading)} body={t(stats.body)} />
      </div>

      {/* One viewport of scrolling per counter on desktop, shortened on phones so the
          sequence does not turn into a very long swipe. svh keeps the sticky stage
          aligned with the visible area under mobile browser chrome. */}
      <div
        ref={trackRef}
        className="[--stat-step:62svh] sm:[--stat-step:100svh]"
        style={{ height: `calc(${cards.length} * var(--stat-step))` }}
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <StatsBackdrop className="absolute left-1/2 top-1/2 h-[70%] max-h-[38rem] w-auto max-w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-70 sm:h-[85%] sm:max-w-none" />

          {cards.map((card, index) => (
            <StatPanel
              key={card.id}
              progress={scrollYProgress}
              index={index}
              total={cards.length}
              caption={t(card.caption)}
              value={card.value}
              suffix={card.suffix}
              label={t(card.label)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
