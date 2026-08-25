"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MagneticButtonProps {
  children: ReactNode;
  /** Distance in pixels at which the element starts reacting to the cursor. */
  radius?: number;
  /** Fraction of the cursor offset the element travels. */
  strength?: number;
  className?: string;
}

const spring = { stiffness: 260, damping: 20, mass: 0.5 } as const;

/**
 * Shifts its child toward the cursor once the pointer is within `radius` of the element
 * centre. Tracking happens on the window rather than the element so the pull begins before
 * the cursor arrives, which is what makes the effect read as magnetic.
 */
export function MagneticButton({
  children,
  radius = 130,
  strength = 0.28,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    function onPointerMove(event: PointerEvent) {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const node = ref.current;
        if (!node) {
          return;
        }

        const bounds = node.getBoundingClientRect();
        const dx = event.clientX - (bounds.left + bounds.width / 2);
        const dy = event.clientY - (bounds.top + bounds.height / 2);

        if (Math.hypot(dx, dy) > radius) {
          x.set(0);
          y.set(0);
          return;
        }

        x.set(dx * strength);
        y.set(dy * strength);
      });
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [radius, strength, x, y]);

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      <motion.span style={{ x, y }} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}
