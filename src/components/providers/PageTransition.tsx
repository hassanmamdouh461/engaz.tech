"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "@/lib/use-gsap-lenis";

/**
 * Two overgrown strokes sweep across the viewport and thicken until they cover it,
 * the destination is jumped to behind the cover, then the strokes sweep off the other
 * side. Adapted from the SVG stroke page transition by Animmaster.
 *
 * The point is that nothing scrolls: the reader is moved instantly while the screen
 * is covered, so no intermediate section flies past.
 */

const COVER_SECONDS = 0.9;
const UNCOVER_SECONDS = 0.9;
const HEADER_OFFSET = 88;

type Jump = (href: string) => boolean;

let jumpImpl: Jump = () => false;

/** Called by anything that wants to teleport rather than scroll. */
export function teleportTo(href: string): boolean {
  return jumpImpl(href);
}

export function PageTransition({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const svgRef = useRef<SVGSVGElement>(null);
  const busyRef = useRef(false);
  const [active, setActive] = useState(false);

  const jump = useCallback(
    (href: string) => {
      if (!href.startsWith("#")) {
        return false;
      }

      const svg = svgRef.current;
      const target = document.querySelector(href);
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      // Land the reader at the target even when the animation cannot run.
      const land = () => {
        const top = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
        );

        // Set the real scroll position first: Lenis is stopped during the wipe, so a
        // scrollTo through it would be queued rather than applied.
        window.scrollTo({ top, behavior: "auto" });
        // Then hand Lenis the new position so restarting does not animate back.
        lenis?.scrollTo(top, { immediate: true, force: true, lock: true });
      };

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!svg || reduceMotion) {
        land();
        return true;
      }

      if (busyRef.current) {
        return true;
      }
      busyRef.current = true;
      setActive(true);

      // Block user input for the duration. Note this must not hide body overflow:
      // that collapses the scrollable area, and the programmatic landing below would
      // then have nothing to scroll.
      lenis?.stop();

      const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
      const lengths = paths.map((path) => path.getTotalLength());

      paths.forEach((path, index) => {
        gsap.set(path, {
          strokeDasharray: lengths[index],
          strokeDashoffset: lengths[index],
          attr: { "stroke-width": 200 },
        });
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          lenis?.start();
          setActive(false);
          busyRef.current = false;
        },
      });

      // Draw on and fatten until the strokes fill the screen.
      paths.forEach((path) => {
        timeline.to(
          path,
          {
            strokeDashoffset: 0,
            attr: { "stroke-width": 700 },
            duration: COVER_SECONDS,
            ease: "power1.inOut",
          },
          0,
        );
      });

      // Move while the viewport is still mostly covered, not after the cover finishes,
      // so the landing is never visible.
      timeline.add(land, COVER_SECONDS * 0.5);

      // Draw off the far side and reset for the next run.
      paths.forEach((path, index) => {
        timeline.to(
          path,
          {
            strokeDashoffset: -lengths[index],
            attr: { "stroke-width": 200 },
            duration: UNCOVER_SECONDS,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(path, { strokeDashoffset: lengths[index] });
            },
          },
          COVER_SECONDS,
        );
      });

      return true;
    },
    [lenis],
  );

  useEffect(() => {
    jumpImpl = jump;
    return () => {
      jumpImpl = () => false;
    };
  }, [jump]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Leave modified clicks alone: they mean "open elsewhere", not "navigate here".
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      // The skip link exists to move keyboard focus to the content. Covering the
      // screen for a second in the middle of that is hostile, so let it behave
      // natively.
      if (anchor.dataset.noTransition !== undefined) return;

      if (jump(href)) {
        event.preventDefault();
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [jump]);

  return (
    <>
      {children}
      <div
        aria-hidden
        // Overscaled so the stroke ends never reveal a corner of the page.
        className="pointer-events-none fixed left-1/2 top-1/2 z-[90] h-full w-full -translate-x-1/2 -translate-y-1/2 scale-150"
        style={{ visibility: active ? "visible" : "hidden" }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 2453 2535"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262"
            stroke="#ffc412"
            strokeWidth="200"
            strokeLinecap="round"
          />
          <path
            d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012"
            stroke="#7a78ff"
            strokeWidth="200"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}
