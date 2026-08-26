"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tape } from "@/components/ui/Tape";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";
import { dropIn, press, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

const { stats } = content;

const TONES = [
  "bg-brand-cyan",
  "bg-brand-yellow",
  "bg-brand-pink",
  "bg-brand-mint",
] as const;

/** Resting tilts, so the row of panels reads as cards laid down by hand. */
const TILT = [-2, 1.5, -1, 2] as const;

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("en-US"),
  );

  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, count, value]);

  return (
    <span ref={ref} dir="ltr" className="flex items-start justify-center">
      {/* The animated figure is hidden from assistive tech; the real one sits beside it. */}
      <motion.span
        aria-hidden
        className="text-3xl font-bold leading-none tabular-nums xs:text-4xl sm:text-5xl lg:text-6xl"
      >
        {rounded}
      </motion.span>
      <span className="sr-only">{value.toLocaleString("en-US")}</span>
      <span className="mt-0.5 text-lg font-bold sm:mt-1 sm:text-2xl">{suffix}</span>
    </span>
  );
}

export function Stats() {
  const { t } = useLocale();

  return (
    <Section id="impact">
      <SectionHeading
        eyebrow={t(stats.eyebrow)}
        heading={t(stats.heading)}
        body={t(stats.body)}
        accent="mint"
      />

      {/* Two up on a phone rather than one: these are short figures, and a single
          column turns four of them into a lot of scrolling for little content. */}
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-8 grid grid-cols-2 gap-3 xs:gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-4 lg:gap-8"
      >
        {stats.cards.map((card, index) => (
          <li key={card.id} className="h-full">
            <motion.div
              variants={dropIn(TILT[index % TILT.length])}
              whileHover={press(6)}
              className={cn(
                "relative flex h-full flex-col items-center justify-center gap-1.5 border-3 border-edge px-2 py-6 text-center text-black shadow-neo-4 sm:gap-2 sm:px-4 sm:py-8 sm:shadow-neo-6",
                TONES[index % TONES.length],
              )}
            >
              <Tape className="-top-3 end-3 h-6 w-14 rotate-[14deg] sm:end-4 sm:h-7 sm:w-16" />

              <p className="font-mono text-[0.6rem] font-bold uppercase tracking-widest xs:text-xs">
                {t(card.caption)}
              </p>

              <Counter value={card.value} suffix={card.suffix} />

              <p className="mt-0.5 text-xs font-semibold leading-snug xs:text-sm">
                {t(card.label)}
              </p>
            </motion.div>
          </li>
        ))}
      </motion.ul>
    </Section>
  );
}
