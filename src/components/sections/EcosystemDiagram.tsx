"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { cardHover, drawPath, fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { ecosystem } = content;

/**
 * Connector between two stages. Vertical while the grid is stacked, horizontal once it
 * becomes four columns. Positioned with logical offsets so it follows the reading direction.
 */
function StageConnector({ delay }: { delay: number }) {
  const transition = { delay, duration: 0.9, ease: "easeInOut" } as const;

  return (
    <span aria-hidden className="pointer-events-none">
      <svg
        viewBox="0 0 2 34"
        className="absolute -bottom-[2.1rem] start-1/2 h-[34px] w-[2px] -translate-x-1/2 overflow-visible lg:hidden"
      >
        <motion.path
          d="M1 0 V34"
          stroke="url(#stageGradientV)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          variants={drawPath}
          transition={transition}
        />
      </svg>

      <svg
        viewBox="0 0 34 2"
        className="absolute top-1/2 hidden h-[2px] w-[34px] -translate-y-1/2 overflow-visible lg:block ltr:-right-[34px] rtl:-left-[34px]"
      >
        <motion.path
          d="M0 1 H34"
          stroke="url(#stageGradientH)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          variants={drawPath}
          transition={transition}
        />
      </svg>
    </span>
  );
}

function ConnectorGradients() {
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <defs>
        <linearGradient id="stageGradientV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="stageGradientH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EcosystemDiagram() {
  const { t } = useLocale();

  return (
    <Section id="ecosystem">
      <SectionHeading
        eyebrow={t(ecosystem.eyebrow)}
        heading={t(ecosystem.heading)}
        body={t(ecosystem.body)}
      />

      <ConnectorGradients />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-12 lg:grid-cols-4 lg:gap-x-[34px] lg:gap-y-4"
      >
        {ecosystem.stages.map((stage, index) => {
          const Icon = resolveIcon(stage.icon);
          const isLast = index === ecosystem.stages.length - 1;

          return (
            <motion.li key={stage.id} variants={fadeInUp} className="relative">
              <motion.div whileHover={cardHover} className="glass-surface h-full p-6">
                <div className="flex items-center gap-3">
                  <motion.span
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/10 text-cyan-300"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.span>
                  <span className="text-xs font-semibold text-slate-500" dir="ltr">
                    {`0${index + 1}`}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{t(stage.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(stage.body)}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stage.nodes.map((node) => (
                    <li
                      key={node.en}
                      className="rounded-md border border-slate-800 bg-base-900/70 px-2.5 py-1 text-[0.7rem] text-slate-400"
                    >
                      {t(node)}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {isLast ? null : <StageConnector delay={0.25 + index * 0.22} />}
            </motion.li>
          );
        })}
      </motion.ol>
    </Section>
  );
}
