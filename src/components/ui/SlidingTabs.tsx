"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface TabOption {
  id: string;
  label: string;
}

interface SlidingTabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  /**
   * Shared layout id for the highlight pill. Every tab group needs its own value —
   * reusing one id across groups makes the pill fly between them.
   */
  layoutId: string;
  ariaLabel: string;
  className?: string;
}

/**
 * Segmented control whose highlight pill animates between options via shared layout,
 * rather than fading in place.
 */
export function SlidingTabs({
  options,
  activeId,
  onChange,
  layoutId,
  ariaLabel,
  className,
}: SlidingTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/50 p-1 backdrop-blur-md",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.id === activeId;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-neon",
              active ? "text-base-950" : "text-slate-400 hover:text-white",
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-glow"
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
