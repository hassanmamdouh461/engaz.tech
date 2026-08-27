"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Lenis owns the scroll position, so ScrollTrigger has to be told when it moves and
 * has to read its value rather than the window's. Without this bridge every pinned
 * timeline lags the page by a frame or refuses to advance at all.
 */
export function useGsapLenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      // On phones the browser chrome collapsing on scroll changes viewport height.
      // Treating that as a resize re-measures every pin mid-gesture, which remaps the
      // scroll position and throws the reader down the page and back.
      ScrollTrigger.config({ ignoreMobileResize: true });
      registered = true;
    }

    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Refresh once webfonts are applied. Measuring before that gives every pin a
    // start offset based on fallback metrics, and correcting it later is what
    // produced the jump.
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) {
        ScrollTrigger.refresh();
      }
    };

    if (document.fonts?.status === "loaded") {
      refresh();
    } else {
      document.fonts?.ready.then(refresh).catch(refresh);
    }

    return () => {
      cancelled = true;
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);
}

export { gsap, ScrollTrigger };
