import type { Config } from "tailwindcss";

/**
 * Neo-brutalist token set: hard borders, zero-blur offset shadows, flat accent
 * colours. Light and dark are driven by `data-theme` on <html>, so every colour
 * that flips is a CSS variable declared in globals.css.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Theme-dependent, resolved from variables so dark mode needs no variants.
        page: "rgb(var(--c-page) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        edge: "rgb(var(--c-edge) / <alpha-value>)",
        void: "rgb(var(--c-void) / <alpha-value>)",
        rule: "rgb(var(--c-rule) / <alpha-value>)",

        // Accents stay the same in both themes, as in the reference.
        brand: {
          cyan: "#66d9ef",
          yellow: "#ffd93d",
          pink: "#ff6b9d",
          mint: "#a8e6cf",
          blue: "#3b82f6",
          orange: "#ff6d38",
          lime: "#c6fe69",
          violet: "#7a78ff",
          sky: "#b9ddfd",
        },
      },
      fontFamily: {
        sans: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      borderWidth: {
        3: "3px",
        6: "6px",
      },
      boxShadow: {
        // The offset ladder: zero blur, edge colour, always 45 degrees.
        "neo-2": "2px 2px 0 rgb(var(--c-edge))",
        "neo-3": "3px 3px 0 rgb(var(--c-edge))",
        "neo-4": "4px 4px 0 rgb(var(--c-edge))",
        "neo-5": "5px 5px 0 rgb(var(--c-edge))",
        "neo-6": "6px 6px 0 rgb(var(--c-edge))",
        "neo-8": "8px 8px 0 rgb(var(--c-edge))",
        "neo-12": "12px 12px 0 rgb(var(--c-edge))",
        // Pressed state: a zero-offset shadow rather than `none`, so it animates.
        "neo-0": "0 0 0 rgb(var(--c-edge))",
        tape: "0 2px 8px rgb(0 0 0 / 0.15)",
      },
      dropShadow: {
        "neo-5": "5px 5px 0 rgb(var(--c-edge))",
        "neo-6": "6px 6px 0 rgb(var(--c-edge))",
      },
      transitionTimingFunction: {
        // The signature overshoot from the reference loader.
        back: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        // Accelerate then undershoot: reads as gravity.
        gravity: "cubic-bezier(0.36, 0, 0.66, -0.56)",
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
        "letter-pop": {
          "0%": { opacity: "0", transform: "scale(0) rotate(-180deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        "float-deco": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(10deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-25px) rotate(5deg)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pop-out": {
          "0%, 100%": { transform: "translateX(-15px) rotate(-12deg)" },
          "50%": { transform: "translateX(0) rotate(-12deg)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 46s linear infinite",
        "letter-pop": "letter-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "float-deco": "float-deco 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 2.8s ease-in-out infinite",
        "pop-out": "pop-out 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
