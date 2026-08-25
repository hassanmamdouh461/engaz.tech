"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";
import "lenis/dist/lenis.css";

/**
 * Global inertia scrolling. Lenis hijacks wheel input, so it stays off for visitors
 * who asked for reduced motion — they keep the browser's native scrolling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
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
