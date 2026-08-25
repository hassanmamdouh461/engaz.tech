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

export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, ease: "easeInOut" },
      opacity: { duration: 0.2 },
    },
  },
};

export const cardHover = {
  scale: 1.02,
  borderColor: "rgba(0, 240, 255, 0.55)",
  boxShadow: "0 0 20px 2px rgba(0, 240, 255, 0.3)",
  transition: { duration: 0.25, ease: "easeOut" },
} as const;

export const viewportOnce = { once: true, amount: 0.2 } as const;
