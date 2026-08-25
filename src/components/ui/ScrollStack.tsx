"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-driven card stack. Each item sticks below the header for a viewport of
 * scrolling while the next slides over it; buried items scale down so a sliver of
 * their top edge stays visible as a receding pile.
 */

interface StackItemProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: ReactNode;
}

function StackItem({ index, total, progress, children }: StackItemProps) {
  const reduceMotion = useReducedMotion();

  // Items deeper in the pile shrink more; the last one stays at full size.
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div
      className="sticky top-0 flex h-[100svh] items-start justify-center"
      style={{ paddingTop: `calc(6.5rem + ${index * 1.5}rem)` }}
    >
      <motion.article
        style={reduceMotion ? undefined : { scale }}
        className="w-full origin-top overflow-hidden rounded-[2rem] border border-slate-700/50 bg-gradient-to-br from-slate-900 via-base-900 to-base-950 p-8 shadow-2xl sm:p-12"
      >
        {children}
      </motion.article>
    </div>
  );
}

interface ScrollStackProps<T> {
  items: readonly T[];
  /** Stable key for each item. */
  itemKey: (item: T, index: number) => string;
  /** Card body; the surface, sticky positioning, and scaling are supplied. */
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

export function ScrollStack<T>({
  items,
  itemKey,
  renderItem,
  className,
}: ScrollStackProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className={className}>
      {items.map((item, index) => (
        <StackItem
          key={itemKey(item, index)}
          index={index}
          total={items.length}
          progress={scrollYProgress}
        >
          {renderItem(item, index)}
        </StackItem>
      ))}
    </div>
  );
}
