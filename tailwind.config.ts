import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#070a13",
          900: "#0b0f19",
          850: "#0f172a",
        },
        accent: {
          neon: "#00f0ff",
          electric: "#0284c7",
        },
      },
      fontFamily: {
        sans: ["var(--font-latin)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px -6px rgba(0, 240, 255, 0.45)",
        "glow-lg": "0 0 60px -10px rgba(0, 240, 255, 0.5)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        floatOrb: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-24px,0)" },
        },
        driftA: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(110px, 70px) scale(1.08)" },
          "66%": { transform: "translate(-60px, 130px) scale(0.94)" },
        },
        driftB: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-130px, 90px) scale(0.92)" },
          "66%": { transform: "translate(80px, -70px) scale(1.1)" },
        },
        driftC: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(70px, -120px) scale(1.06)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 46s linear infinite",
        "pulse-dot": "pulseDot 2.2s ease-in-out infinite",
        "float-orb": "floatOrb 12s ease-in-out infinite",
        "drift-a": "driftA 26s ease-in-out infinite",
        "drift-b": "driftB 32s ease-in-out infinite",
        "drift-c": "driftC 38s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
