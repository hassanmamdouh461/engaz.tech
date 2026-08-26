"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
import { BrandMark } from "@/components/ui/BrandMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";

const { brand, nav } = content;

export function Navbar() {
  const { t, locale } = useLocale();
  const scrollToAnchor = useAnchorScroll();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const { scrollY } = useScroll();

  // Retracts on the way down and returns on the way up, past a 100px dead zone so
  // it does not flicker on small corrections near the top.
  useMotionValueEvent(scrollY, "change", (current) => {
    if (current > lastScroll.current && current > 100) {
      setHidden(true);
    } else if (current < lastScroll.current) {
      setHidden(false);
    }
    lastScroll.current = current;
  });

  // Lenis drives scrolling from its own handlers, so hiding body overflow alone
  // does not stop the page moving behind the open menu on touch devices.
  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (scrollToAnchor(href)) {
      event.preventDefault();
    }
    setOpen(false);
  }

  return (
    <motion.header
      animate={{ y: hidden && !open ? "-140%" : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-[15px] z-[60] mx-[10px] mt-[10px] sm:mx-[15px] sm:mt-[15px]"
    >
      <div className="border-4 border-edge bg-brand-yellow shadow-neo-8">
        <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <a
            href="#home"
            onClick={(event) => handleAnchorClick(event, "#home")}
            className="flex items-center gap-2 rounded-md border-3 border-edge bg-brand-cyan px-2 py-1 text-black shadow-neo-3 transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-neo-0 sm:gap-3 sm:px-3"
          >
            <BrandMark className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="text-lg font-bold tracking-tight sm:text-xl">
              {t(brand.name)}
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {nav.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(event) => handleAnchorClick(event, link.href)}
                className="origin-bottom-right text-base font-semibold text-black transition-transform duration-200 hover:-translate-y-[3px] hover:-rotate-2 hover:scale-110"
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitch locale={locale} ariaLabel={t(nav.languageToggle)} />
            <ThemeToggle />
            <a
              href="#contact"
              onClick={(event) => handleAnchorClick(event, "#contact")}
              className="neo-btn-sm hidden bg-brand-cyan sm:inline-flex"
            >
              {t(nav.cta)}
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? t(nav.closeMenu) : t(nav.openMenu)}
              className="neo-icon-btn lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 overflow-hidden border-4 border-edge bg-surface shadow-neo-8 lg:hidden"
          >
            {/* Capped to the viewport minus the header so the call to action stays reachable in landscape. */}
            <nav
              aria-label="Mobile"
              className="flex max-h-[calc(100svh-8rem)] flex-col gap-1 overflow-y-auto p-3"
            >
              {nav.links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={(event) => handleAnchorClick(event, link.href)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + index * 0.035, duration: 0.28 }}
                  className="border-3 border-transparent px-3 py-3 text-base font-semibold text-ink transition-colors hover:border-edge hover:bg-brand-yellow hover:text-black"
                >
                  {t(link.label)}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={(event) => handleAnchorClick(event, "#contact")}
                className="neo-btn-primary mt-2"
              >
                {t(nav.cta)}
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
