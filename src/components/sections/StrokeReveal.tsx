"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";
import { gsap, ScrollTrigger, useGsapLenisBridge } from "@/lib/use-gsap-lenis";

const { hero } = content;

/**
 * Three rows of three fat strokes. The reveal order deliberately jumps between rows
 * rather than filling one at a time, so the block assembles unevenly and reads as
 * drawing rather than as a progress bar.
 */
const ROWS = [
  { id: "top", colors: ["#ff6d38", "#c6fe69", "#7a78ff"] },
  { id: "middle", colors: ["#7a78ff", "#b9ddfd", "#c6fe69"] },
  { id: "bottom", colors: ["#ffc412", "#ff6d38", "#b9ddfd"] },
] as const;

const REVEAL_ORDER = [
  "top-1",
  "bottom-1",
  "middle-1",
  "top-2",
  "bottom-2",
  "middle-2",
  "top-3",
  "middle-3",
  "bottom-3",
] as const;

const CURVES = [
  { id: "curve-1", color: "#ffc412" },
  { id: "curve-2", color: "#ff6d38" },
] as const;

const CURVE_PATH = "M180 180.538C1512.01 180.54 1718.64 133.099 2067.5 931.594";

export function StrokeReveal() {
  useGsapLenisBridge();
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lines = Array.from(section.querySelectorAll<HTMLElement>("[data-line]"));
    if (lines.length < 2) return;

    // First line fully shown, every later one clipped away until its pass arrives.
    lines.forEach((line, index) => {
      line.style.clipPath = index === 0 ? "inset(0 0 0 0%)" : "inset(0 100% 0 0)";
    });

    const context = gsap.context(() => {
      // Dash the strokes to their own length so each one draws from nothing.
      const paths = gsap.utils.toArray<SVGPathElement>(".stroke-line");
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const timeline = gsap.timeline();

      // Eight viewports on a desktop reads as deliberate; on a phone the same
      // sequence becomes an interminable swipe, so the pin is shorter there.
      const viewports = () => (window.innerWidth < 768 ? 4 : 8);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // Resolved on every refresh so a rotation or a collapsing browser bar
        // recomputes the distance instead of keeping a stale pixel value.
        // Measured from the bars-retracted height so the distance does not shift when
        // the browser bar collapses mid-scroll.
        end: () => `+=${document.documentElement.clientHeight * viewports()}`,
        pin: true,
        pinSpacing: true,
        // No smoothing on the scrub: with Lenis already easing the scroll, a second
        // easing layer lags the timeline behind the page and reads as a snap-back.
        scrub: true,
        animation: timeline,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          section.dataset.phase = self.progress >= 0.5 ? "out" : "in";
        },
        onRefresh: (self) => {
          // A reload restores the previous scroll position, which can land inside the
          // pin range. Adopt that position rather than correcting the page to it.
          section.dataset.phase = self.progress >= 0.5 ? "out" : "in";
        },
      });

      REVEAL_ORDER.forEach((id, index) => {
        timeline.to(
          `#stroke-${id} .stroke-line`,
          { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" },
          index * 0.3,
        );
      });

      // The curves arrive after the fifth stroke, draw in, then unwind the same way.
      const curveStart = 5 * 0.3 + 0.3;
      CURVES.forEach((curve, index) => {
        const selector = `#stroke-${curve.id} .stroke-line`;
        const target = document.querySelector<SVGPathElement>(selector);
        if (!target) return;
        const length = target.getTotalLength();
        const at = curveStart + index;

        timeline.to(selector, { strokeDashoffset: 0, duration: 1, ease: "power2.out" }, at);
        timeline.to(
          selector,
          { strokeDashoffset: -length, duration: 1.5, ease: "power2.inOut" },
          at + 1,
        );
      });

      // The bands then make one pass per line change: each pass sweeps across, and the
      // wipe edge rides that same tween so the words are replaced exactly where the
      // band's leading edge crosses them. The final pass leaves the bands off-screen.
      const PASS_DURATION = 2;

      lines.slice(0, -1).forEach((_, index) => {
        const current = lines[index];
        const next = lines[index + 1];
        const wipe = { at: 0 };
        const first = index === 0;

        // The bands already cover the frame on the first pass; later passes have to
        // re-enter from the left before they can cross again.
        if (!first) {
          timeline.set(".stroke-row", { xPercent: -100 });
        }

        timeline.to(
          ".stroke-row",
          {
            xPercent: 100,
            duration: PASS_DURATION,
            ease: "power3.inOut",
            stagger: 0.15,
          },
          first ? ">-0.5" : ">",
        );

        timeline.to(
          wipe,
          {
            at: 100,
            duration: PASS_DURATION,
            ease: "power3.inOut",
            onUpdate: () => {
              // One moving edge for both lines: the next line is revealed exactly
              // where the current one is hidden, so no gap or overlap can appear.
              current.style.clipPath = `inset(0 0 0 ${wipe.at}%)`;
              next.style.clipPath = `inset(0 ${100 - wipe.at}% 0 0)`;
            },
          },
          "<",
        );
      });

    }, section);

    return () => {
      context.revert();
      for (const line of lines) {
        line.style.removeProperty("clip-path");
      }
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      data-phase="in"
      aria-label={t(hero.headlineLead)}
      className="group/stroke relative isolate z-0 h-svh min-h-[100lvh] w-full overflow-hidden bg-[#e3e3db] transition-colors duration-500 data-[phase=out]:bg-[#141414]"
    >
      {/* One heading for assistive tech; the two visual layers below are decorative
          halves of a single wipe and would otherwise be announced twice. */}
      <h2 className="sr-only">
        {`${t(hero.headlineLead)} ${t(hero.headlineAccent)}`}
      </h2>

      {/* Both lines occupy the same box. A single clip edge travels across them with
          the sweeping band: what the band has passed shows the second line, what it
          has not still shows the first, so the words read as printed on the band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[86%] -translate-x-1/2 -translate-y-1/2 sm:w-3/4 lg:w-1/2"
      >
        <p
          data-line="lead"
          className="text-center text-xl font-bold uppercase leading-[0.95] text-black xs:text-2xl sm:text-4xl lg:text-6xl"
        >
          {t(hero.headlineLead)}
        </p>
        <p
          data-line="accent"
          className="absolute inset-0 text-center text-xl font-bold uppercase leading-[0.95] text-white xs:text-2xl sm:text-4xl lg:text-6xl"
        >
          {t(hero.headlineAccent)}
        </p>
      </div>

      {/* Overscaled so the strokes read as slabs crossing the frame, not as lines.
          A phone needs far more overscale than a desktop for the same read, because
          the slab thickness is set by the viewport height, not its width. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-svh min-h-[100lvh] w-[1200%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center sm:w-[600%] lg:w-[300%]"
      >
        {ROWS.map((row) => (
          <div key={row.id} className="stroke-row relative h-full w-full flex-1 will-change-transform">
            {row.colors.map((color, index) => (
              <svg
                key={index}
                id={`stroke-${row.id}-${index + 1}`}
                viewBox="0 0 3360 360"
                fill="none"
                preserveAspectRatio="none"
                className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-visible"
              >
                {/* Dark twin behind each stroke: the outline that separates stacked slabs. */}
                <path
                  className="stroke-line"
                  d="M180 180H3180"
                  stroke="#0f0f0f"
                  strokeWidth={370}
                  strokeLinecap="round"
                />
                <path
                  className="stroke-line"
                  d="M180 180H3180"
                  stroke={color}
                  strokeWidth={360}
                  strokeLinecap="round"
                />
              </svg>
            ))}
          </div>
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 flex h-svh min-h-[100lvh] w-[1200%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center sm:w-[600%] lg:w-[300%]"
      >
        <div className="relative h-full w-full flex-1" />
        <div className="relative h-full w-full flex-1">
          {CURVES.map((curve) => (
            <svg
              key={curve.id}
              id={`stroke-${curve.id}`}
              viewBox="0 -10 2248 1132"
              fill="none"
              className="absolute left-[40%] top-0 h-[310%] -translate-x-1/2 overflow-visible"
            >
              <path
                className="stroke-line"
                d={CURVE_PATH}
                stroke={curve.color}
                strokeWidth={360}
                strokeLinecap="round"
              />
            </svg>
          ))}
        </div>
        <div className="relative h-full w-full flex-1" />
      </div>
    </section>
  );
}
