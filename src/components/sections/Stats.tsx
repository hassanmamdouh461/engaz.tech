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
        className="text-4xl font-bold leading-none tabular-nums sm:text-5xl lg:text-6xl"
      >
        {rounded}
      </motion.span>
      <span className="sr-only">{value.toLocaleString("en-US")}</span>
      <span className="mt-1 text-xl font-bold sm:text-2xl">{suffix}</span>
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

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
      >
        {stats.cards.map((card, index) => (
          <li key={card.id} className="h-full">
            <motion.div
              variants={dropIn(TILT[index % TILT.length])}
              whileHover={press(6)}
              className={cn(
                "relative flex h-full flex-col items-center justify-center gap-2 border-3 border-edge px-4 py-8 text-center text-black shadow-neo-6",
                TONES[index % TONES.length],
              )}
            >
              <Tape className="-top-3 end-4 h-7 w-16 rotate-[14deg]" />

              <p className="font-mono text-xs font-bold uppercase tracking-widest">
                {t(card.caption)}
              </p>

              <Counter value={card.value} suffix={card.suffix} />

              <p className="mt-1 text-sm font-semibold leading-snug">{t(card.label)}</p>
            </motion.div>
          </li>
        ))}
      </motion.ul>
    </Section>
  );
}
