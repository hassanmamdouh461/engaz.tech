import { Cairo, Plus_Jakarta_Sans } from "next/font/google";

export const latin = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-latin",
});

export const arabic = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-arabic",
});

export const fontVariables = `${latin.variable} ${arabic.variable}`;
