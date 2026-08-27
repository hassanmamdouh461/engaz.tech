"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useIntroDone } from "@/lib/intro-state";
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
  const introDone = useIntroDone();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // The loader locks body overflow while it is up. Building the pin against a
    // locked page measures the wrong start offset, and ScrollTrigger corrects it on
    // the first gesture by yanking the page down and back.
    if (!introDone) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

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

      // Finally the whole block slides off, one row at a time.
      timeline.to(
        ".stroke-row",
        { xPercent: 100, duration: 2, ease: "power3.inOut", stagger: 0.15 },
        ">-0.5",
      );
    }, section);

    return () => context.revert();
  }, [locale, introDone]);

  return (
    <section
      ref={sectionRef}
      data-phase="in"
      aria-label={t(hero.headlineLead)}
      className="group/stroke relative isolate z-0 h-svh min-h-[100lvh] w-full overflow-hidden bg-[#e3e3db] transition-colors duration-500 data-[phase=out]:bg-[#141414]"
    >
      {/* Two headlines occupy the same spot; the phase attribute decides which shows. */}
      <h2 className="absolute left-1/2 top-1/2 z-10 w-[86%] -translate-x-1/2 -translate-y-1/2 text-center text-xl font-bold uppercase leading-[0.95] text-black group-data-[phase=out]/stroke:hidden xs:text-2xl sm:w-3/4 sm:text-4xl lg:w-1/2 lg:text-6xl">
        {t(hero.headlineLead)}
      </h2>
      <h2 className="absolute left-1/2 top-1/2 z-10 hidden w-[86%] -translate-x-1/2 -translate-y-1/2 text-center text-xl font-bold uppercase leading-[0.95] text-white group-data-[phase=out]/stroke:block xs:text-2xl sm:w-3/4 sm:text-4xl lg:w-1/2 lg:text-6xl">
        {t(hero.headlineAccent)}
      </h2>

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
