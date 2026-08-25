"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

const HEADER_OFFSET = 88;

/**
 * Anchor navigation that clears the fixed header instead of hiding the section heading
 * behind it. Routes through Lenis when smooth scrolling is active so the easing matches
 * the rest of the page, and falls back to the native scroll otherwise.
 */
export function useAnchorScroll() {
  const lenis = useLenis();

  return useCallback(
    (href: string) => {
      if (!href.startsWith("#")) {
        return false;
      }

      const target = document.querySelector(href);
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      if (lenis) {
        lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1.2 });
        return true;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      return true;
    },
    [lenis],
  );
}
