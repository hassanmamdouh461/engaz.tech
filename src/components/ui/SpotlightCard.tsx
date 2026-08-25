"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { useCallback, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SpotlightCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Radius of the glow in pixels. */
  radius?: number;
  className?: string;
}

/**
 * Card surface that tracks the cursor and paints a radial glow on both the background
 * and the border. Opacity springs to zero on leave so the glow fades instead of snapping.
 */
export function SpotlightCard({
  children,
  radius = 320,
  className,
  ...rest
}: SpotlightCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useSpring(0, { stiffness: 180, damping: 26 });

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, rgba(0, 240, 255, 0.15), transparent 70%)`;
  const borderGlow = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, rgba(0, 240, 255, 0.55), transparent 65%)`;

  const handleMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      x.set(event.clientX - bounds.left);
      y.set(event.clientY - bounds.top);
    },
    [x, y],
  );

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseEnter={() => opacity.set(1)}
      onMouseLeave={() => opacity.set(0)}
      className={cn("group relative isolate overflow-hidden rounded-2xl", className)}
      {...rest}
    >
      {/* Border layer: a full-bleed gradient masked to the 1px inset ring. */}
      <motion.span
        aria-hidden
        style={{ background: borderGlow, opacity }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude] p-px"
      />
      <motion.span
        aria-hidden
        style={{ background, opacity }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
      />
      {children}
    </motion.div>
  );
}
