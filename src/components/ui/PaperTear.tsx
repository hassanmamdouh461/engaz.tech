"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Tape } from "@/components/ui/Tape";

/**
 * Hand-authored torn edge: a quadratic ribbon oscillating irregularly around the
 * midline. The irregularity is what reads as torn rather than wavy, so the control
 * points are fixed rather than generated.
 */
const TEAR =
  "M0,15 Q10,5 20,15 T40,15 Q50,5 60,15 T80,15 Q90,20 100,15 T120,15 Q130,10 140,15 T160,15 Q170,5 180,15 T200,15 Q210,20 220,15 T240,15 Q250,8 260,15 T280,15 Q290,18 300,15 T320,15 Q330,5 340,15 T360,15 Q370,12 380,15 T400,15 Q410,20 420,15 T440,15 Q450,6 460,15 T480,15 Q490,16 500,15 T520,15 Q530,8 540,15 T560,15 Q570,20 580,15 T600,15 Q610,10 620,15 T640,15 Q650,5 660,15 T680,15 Q690,18 700,15 T720,15 Q730,12 740,15 T760,15 Q770,7 780,15 T800,15 Q810,20 820,15 T840,15 Q850,9 860,15 T880,15 Q890,14 900,15 T920,15 Q930,6 940,15 T960,15 Q970,19 980,15 T1000,15 Q1010,11 1020,15 T1040,15 Q1050,5 1060,15 T1080,15 Q1090,17 1100,15 T1120,15 Q1130,8 1140,15 T1160,15 Q1170,13 1180,15 T1200,15 Q1210,20 1220,15 T1240,15 Q1250,7 1260,15 T1280,15 Q1290,16 1300,15 T1320,15 Q1330,10 1340,15 T1360,15 Q1370,5 1380,15 T1400,15 Q1410,18 1420,15 T1440,15";

/** The fills swap between the two edges so the space between reads as a gap in the sheet. */
function TearEdge({ variant }: { variant: "top" | "bottom" }) {
  const above = variant === "top" ? "rgb(var(--c-page))" : "rgb(var(--c-void))";
  const below = variant === "top" ? "rgb(var(--c-void))" : "rgb(var(--c-page))";

  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 30"
      preserveAspectRatio="none"
      className="block h-5 w-full sm:h-[30px]"
    >
      <path d={`${TEAR} L1440,0 L0,0 Z`} fill={above} />
      <path d={`${TEAR} L1440,30 L0,30 Z`} fill={below} />
      <path
        d={TEAR}
        fill="none"
        stroke="rgb(var(--c-edge))"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A gap torn across the sheet that closes as you scroll past it, then gets taped
 * shut. The two edges march together, the backing behind them fades, and the tape
 * flops down flat onto the seam.
 */
export function PaperTear() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });

  const gapHeight = useTransform(scrollYProgress, [0, 0.62], [300, 0]);
  const overlap = useTransform(scrollYProgress, [0.62, 0.72], [0, -30]);
  const backingOpacity = useTransform(scrollYProgress, [0.62, 0.72], [1, 0]);

  // The tape lands after the seam is closed: lifted and tilted away, then flat.
  const tapeY = useTransform(scrollYProgress, [0.78, 1], [-40, 0]);
  const tapeZ = useTransform(scrollYProgress, [0.78, 1], [30, 0]);
  const tapeRotateX = useTransform(scrollYProgress, [0.78, 1], [35, 0]);
  const tapeOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  if (reduceMotion) {
    return (
      <div className="relative" aria-hidden>
        <TearEdge variant="bottom" />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative [perspective:1000px]">
      {/* Hidden below the tablet breakpoint: 300px of empty gap costs more than it gives. */}
      <div className="hidden md:block">
        <div className="-mb-px">
          <TearEdge variant="top" />
        </div>

        <motion.div style={{ height: gapHeight }} className="w-full bg-void" />

        <motion.div style={{ marginTop: overlap }} className="relative -mb-px">
          <motion.div style={{ opacity: backingOpacity }} className="absolute inset-0 bg-void" />
          <TearEdge variant="bottom" />

          <motion.div
            style={{
              y: tapeY,
              z: tapeZ,
              rotateX: tapeRotateX,
              opacity: tapeOpacity,
              rotate: -8,
              transformOrigin: "left center",
            }}
            className="absolute end-[10%] top-1/2 h-[45px] w-[120px] -translate-y-1/2"
          >
            <Tape className="inset-0" />
          </motion.div>
        </motion.div>
      </div>

      {/* On small screens only the drawn edge survives, as a section rule. */}
      <div className="md:hidden">
        <svg
          aria-hidden
          viewBox="0 0 1440 30"
          preserveAspectRatio="none"
          className="block h-5 w-full"
        >
          <path
            d={TEAR}
            fill="none"
            stroke="rgb(var(--c-edge))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
