"use client";

import { MotionConfig } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { ScrollTrigger, useGsapLenisBridge } from "@/lib/use-gsap-lenis";
import "lenis/dist/lenis.css";

/**
 * With autoRaf off, this bridge is the only thing that ticks Lenis, so it is
 * mounted here with Lenis itself rather than inside whichever section first
 * happens to need ScrollTrigger. It sits ahead of the page so its effect
 * registers the plugin before any section's effect creates a trigger.
 */
function GsapLenisBridge() {
  useGsapLenisBridge();
  return null;
}

/**
 * Global inertia scrolling. Lenis owns the wheel input and ScrollTrigger reads
 * through it. Visitors who asked for reduced motion keep the browser's native
 * scrolling, and Framer Motion drops movement from its animations for them.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Lift the pre-hydration scroll lock set by the inline <head> script. This
    // effect runs after every descendant's mount effect, so all pins already
    // exist before the page can scroll. Restoring the scrollable area changes
    // document height, so the triggers re-measure once on the next frame.
    document.documentElement.style.overflow = "";
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  // "user" makes Framer read the OS setting itself when an animation starts, so
  // it changes motion, not markup, and stays out of hydration.
  return (
    <MotionConfig reducedMotion="user">
      {reduceMotion ? (
        <>
          <GsapLenisBridge />
          {children}
        </>
      ) : (
        <ReactLenis
          root
          options={{
            // gsap.ticker drives lenis.raf from useGsapLenisBridge; leaving autoRaf
            // on would feed Lenis two different clocks per frame and the scroll
            // position overshoots then snaps back at every pin.
            autoRaf: false,
            duration: 1.15,
            lerp: 0.09,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.4,
          }}
        >
          <GsapLenisBridge />
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
