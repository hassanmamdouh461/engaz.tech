import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { BackgroundDecor } from "@/components/ui/BackgroundDecor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { LocaleProvider } from "@/lib/locale-context";
import "./globals.css";

const latin = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-latin",
});

const arabic = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "TECH CORP — Nation-Scale Digital Transformation",
  description:
    "We architect, build, and operate mission-critical digital platforms for governments and financial institutions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${latin.variable} ${arabic.variable}`}>
      <body className="font-sans">
        <LocaleProvider>
          <SmoothScroll>
            <BackgroundDecor />
            <a
              href="#home"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-base-950"
            >
              Skip to content
            </a>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  );
}
