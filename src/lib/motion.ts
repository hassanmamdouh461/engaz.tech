import type { Variants } from "framer-motion";

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Horizontal entrance: negative offsets enter from the left, positive from the right. */
export function slideInX(offset: number): Variants {
  return {
    hidden: { opacity: 0, x: offset },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };
}


/** Overshoot easing: the signature snap on anything that pops into place. */
export const backOut = [0.68, -0.55, 0.265, 1.55] as const;

/**
 * Cards enter slightly rotated and settle straight, so a grid of them reads as
 * pieces laid on paper rather than as a rendered layout.
 */
export function dropIn(tilt: number): Variants {
  return {
    hidden: { opacity: 0, y: 34, rotate: tilt },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

/**
 * The press. The element travels the full shadow offset and the shadow collapses,
 * so the surface appears to meet the page. A zero-offset shadow rather than `none`
 * keeps the property animatable.
 */
export function press(offset = 4) {
  return {
    x: offset,
    y: offset,
    boxShadow: "0 0 0 rgb(var(--c-edge))",
    transition: { duration: 0.18, ease: "easeOut" },
  } as const;
}

/** The inverse: a lift, for elements that should look picked up rather than pushed down. */
export const lift = {
  y: -10,
  rotate: 0,
  transition: { duration: 0.3, ease: "easeOut" },
} as const;

export const viewportOnce = { once: true, amount: 0.2 } as const;
