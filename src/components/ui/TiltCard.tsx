"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TiltCardProps {
  children: ReactNode;
  /** Maximum rotation in degrees at the card edges. */
  intensity?: number;
  className?: string;
}

const spring = { stiffness: 220, damping: 24, mass: 0.6 } as const;

/**
 * Spring-based 3D tilt driven by cursor position. Pointer coordinates are normalized to
 * -0.5..0.5 so the rotation is symmetric regardless of card size, and the springs settle
 * back to flat on leave.
 */
export function TiltCard({ children, intensity = 8, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [intensity, -intensity]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-intensity, intensity]), spring);

  const handleMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      px.set((event.clientX - bounds.left) / bounds.width - 0.5);
      py.set((event.clientY - bounds.top) / bounds.height - 0.5);
    },
    [px, py],
  );

  const reset = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return (
    <div ref={ref} className={cn("[perspective:1100px]", className)}>
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
