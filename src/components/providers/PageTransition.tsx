"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { useIntroDone } from "@/lib/intro-state";
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

/**
 * Resolves "#id" to its element. getElementById rather than querySelector: an id
 * that starts with a digit or holds CSS syntax is a valid fragment but an invalid
 * selector, and querySelector would throw on it.
 */
function targetFor(hash: string): HTMLElement | null {
  if (!hash.startsWith("#") || hash.length < 2) return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Malformed escape: fall back to the raw fragment.
  }
  return document.getElementById(id);
}

/**
 * Moves keyboard and screen-reader focus to the section the reader landed on.
 * Without this the visual jump happens but focus stays on the nav link, so the
 * next Tab press goes back to the header instead of into the section.
 */
function focusTarget(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
}

export function PageTransition({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const svgRef = useRef<SVGSVGElement>(null);
  const busyRef = useRef(false);
  const [active, setActive] = useState(false);
  const introDone = useIntroDone();

  /** Instant move to a section, shared by the wipe, deep links, and Back/Forward. */
  const scrollToTarget = useCallback(
    (target: HTMLElement) => {
      const land = () => {
        const top = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
        );

        // Lenis re-measures the page on a 250ms debounce. A deep link lands right
        // after ScrollTrigger inserts the pin spacer, so without this Lenis still
        // holds the shorter page's limit and clamps the jump into the pinned section.
        lenis?.resize();

        // The mobile drawer also locks <html> overflow while open; if its
        // cleanup has not flushed yet on a slow phone, a jump issued here would
        // land on a page with nothing to scroll. Clearing it again is harmless —
        // the drawer is already on its way out.
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        // html{scroll-behavior:smooth} makes every programmatic scroll glide, and
        // scrollTo({behavior:"auto"}) defers to that CSS value — including the
        // fallback WebKit uses when it does not know "instant". Suspend it for the
        // jump so the landing cannot turn into a second-long page scroll under the
        // wipe on iOS Safari.
        const root = document.documentElement;
        const prevScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        // scrollTop assignment rather than scrollTo options: it jumps on engines
        // that do not parse the options bag, and with smooth suspended it cannot
        // animate.
        root.scrollTop = top;
        document.body.scrollTop = top;
        window.scrollTo({ top, behavior: "auto" });
        // Then hand Lenis the new position so restarting does not animate back.
        lenis?.scrollTo(top, { immediate: true, force: true, lock: true });
        root.style.scrollBehavior = prevScrollBehavior;
      };

      land();

      // Scroll-driven layout above the target (the paper tear closing its gap) only
      // settles on the frames after the jump, pulling the target up by its height.
      // Measure again once it has applied and correct if the target moved.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (Math.abs(target.getBoundingClientRect().top - HEADER_OFFSET) > 1) {
            land();
          }
        }),
      );
    },
    [lenis],
  );

  const jump = useCallback(
    (href: string) => {
      const svg = svgRef.current;
      const target = targetFor(href);
      if (!target) {
        return false;
      }

      // Land the reader at the target even when the animation cannot run. The URL
      // follows along, so Back, reload, and "copy link" all point at the section.
      const land = () => {
        scrollToTarget(target);
        if (window.location.hash !== href) {
          window.history.pushState(null, "", href);
        }
        focusTarget(target);
      };

      if (!svg) {
        land();
        return true;
      }

      if (busyRef.current) {
        return true;
      }
      busyRef.current = true;
      setActive(true);
      // Flag the run on <html>: the mobile drawer close effect restarts Lenis on
      // the same tap, and checking this there keeps it from undoing the stop below.
      document.documentElement.dataset.wipe = "1";

      // Block user input for the duration. Note this must not hide body overflow:
      // that collapses the scrollable area, and the programmatic landing below would
      // then have nothing to scroll.
      lenis?.stop();

      const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
      const lengths = paths.map((path) => path.getTotalLength());

      // Pin both strokes to the same fat width and hide them off-screen at the start.
      // Keeping the width constant across the whole run means the line never thins out
      // mid-wipe on portrait phones: the wave shapes never poke a gap through the
      // cover, and the uncover leaves no thin wavy strip behind it.
      const COVER_STROKE = 700;
      paths.forEach((path, index) => {
        gsap.set(path, {
          strokeDasharray: lengths[index],
          strokeDashoffset: lengths[index],
          attr: { "stroke-width": COVER_STROKE },
        });
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          lenis?.start();
          delete document.documentElement.dataset.wipe;
          setActive(false);
          // Held briefly past the end: a tap can emit a second, late click on some
          // mobile engines, and releasing immediately let it start the wipe again.
          window.setTimeout(() => {
            busyRef.current = false;
          }, 260);
        },
      });

      // Draw on until the strokes fill the screen. Width stays at COVER_STROKE so
      // the cover reads as a full sheet even on tall portrait phones.
      paths.forEach((path) => {
        timeline.to(
          path,
          {
            strokeDashoffset: 0,
            duration: COVER_SECONDS,
            ease: "power1.inOut",
          },
          0,
        );
      });

      // Move while the viewport is still mostly covered, not after the cover finishes,
      // so the landing is never visible.
      timeline.add(land, COVER_SECONDS * 0.5);

      // Draw off the far side with the width still locked at COVER_STROKE. The old
      // version shrank the stroke back to 200 here, which on a portrait phone left
      // a thin wavy strip and let the new page bleed through the gaps mid-uncover.
      paths.forEach((path, index) => {
        timeline.to(
          path,
          {
            strokeDashoffset: -lengths[index],
            duration: UNCOVER_SECONDS,
            ease: "power1.inOut",
          },
          COVER_SECONDS,
        );
      });

      // Reset every path together once the full timeline is done. The per-stroke
      // onComplete was firing on the slowest phone while the dash was still partly
      // off-screen, snapping the path back into view for a frame.
      timeline.call(
        () => {
          paths.forEach((path, index) => {
            gsap.set(path, {
              strokeDashoffset: lengths[index],
              attr: { "stroke-width": COVER_STROKE },
            });
          });
        },
        [],
        COVER_SECONDS + UNCOVER_SECONDS,
      );

      return true;
    },
    [lenis, scrollToTarget],
  );

  // Deep links (/#contact) and Back/Forward. The browser's own anchor jump on load
  // happens while the intro curtain holds the page and before the pinned stroke
  // section inserts its spacer, so it lands in the wrong place. Re-land once the
  // curtain is gone and ScrollTrigger has re-measured (StrokeReveal refreshes on
  // the same signal, and child effects run before this one).
  const deepLinkHandledRef = useRef(false);
  useEffect(() => {
    // Once per page load: a later Lenis instance change must not yank the reader
    // back to the fragment they arrived on.
    if (!introDone || deepLinkHandledRef.current) return;
    deepLinkHandledRef.current = true;
    const target = targetFor(window.location.hash);
    if (target) {
      scrollToTarget(target);
    }
  }, [introDone, scrollToTarget]);

  // Back/Forward lands through scrollToTarget, so the browser's own scroll
  // restore must not race the jump: on "auto" Chrome can replay a stale saved
  // offset over the landing and leave the reader sections away (observed ending
  // at the page bottom for a #work back-navigation). Manual hands the whole
  // landing to the popstate handler below.
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const target = targetFor(window.location.hash);
      if (target) {
        scrollToTarget(target);
        focusTarget(target);
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
        lenis?.scrollTo(0, { immediate: true, force: true });
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [lenis, scrollToTarget]);

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
