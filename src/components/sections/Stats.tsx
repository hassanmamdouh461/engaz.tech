"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { CountryOutline } from "@/components/ui/CountryOutline";
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

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-lg font-bold text-blue-400 sm:text-xl">{caption}</p>

      <p className="mt-2 flex items-start justify-center text-white">
        <motion.span
          dir="ltr"
          className="text-[4.5rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-[7rem] lg:text-[9rem]"
        >
          {display}
        </motion.span>
        <span className="mt-3 text-2xl font-bold sm:mt-6 sm:text-4xl">{suffix}</span>
      </p>

      <p className="mt-4 max-w-md text-base text-slate-400 sm:text-xl">{label}</p>
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
      <div className="mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8 md:pt-28">
        <SectionHeading heading={t(stats.heading)} body={t(stats.body)} />
      </div>

      {/* Track height sets how much scrolling the sequence consumes. */}
      <div ref={trackRef} style={{ height: `${cards.length * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <CountryOutline className="absolute left-1/2 top-1/2 h-[85%] max-h-[38rem] -translate-x-1/2 -translate-y-1/2 opacity-80" />

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
