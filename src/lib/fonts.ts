import { Caveat, Cairo, Space_Grotesk, Space_Mono } from "next/font/google";

/** Display and body face for Latin copy. */
export const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

/** Metadata: dates, places, chips, code. */
export const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});

/** Handwritten annotations. Latin only — it has no Arabic coverage. */
export const hand = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-hand",
});

/** Arabic face. Cairo is geometric enough to sit next to Space Grotesk. */
export const arabic = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-arabic",
});

export const fontVariables = `${display.variable} ${mono.variable} ${hand.variable} ${arabic.variable}`;
