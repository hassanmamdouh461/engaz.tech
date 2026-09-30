"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/use-gsap-lenis";
import "lenis/dist/lenis.css";

/** Global inertia scrolling. Lenis owns the wheel input and ScrollTrigger reads through it. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lift the pre-hydration scroll lock set by the inline <head> script. This
    // effect runs after every descendant's mount effect, so all pins already
    // exist before the page can scroll. Restoring the scrollable area changes
    // document height, so the triggers re-measure once on the next frame.
    document.documentElement.style.overflow = "";
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <ReactLenis
      root
      options={{
        // gsap.ticker drives lenis.raf from useGsapLenisBridge; leaving autoRaf on
        // would feed Lenis two different clocks per frame and the scroll position
        // overshoots then snaps back at every pin.
        autoRaf: false,
        duration: 1.15,
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  );
}
