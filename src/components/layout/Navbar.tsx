"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";
import { useAnchorScroll } from "@/lib/use-anchor-scroll";
import { cn } from "@/lib/cn";

const { brand, nav } = content;

const localeTabs = [
  { id: "en", label: "EN" },
  { id: "ar", label: "ع" },
];

export function Navbar() {
  const { t, locale, setLocale } = useLocale();
  const scrollToAnchor = useAnchorScroll();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleAnchorClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (scrollToAnchor(href)) {
      event.preventDefault();
    }
    setOpen(false);
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      {/* Transparent while at the top; condenses into a floating pill once scrolled. */}
      <div
        className={cn(
          "mx-auto w-full max-w-7xl transition-all duration-300",
          scrolled
            ? "rounded-full border border-slate-700/60 bg-base-950/70 shadow-2xl backdrop-blur-xl"
            : "rounded-full border border-transparent",
        )}
      >
        <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem]">
          <a
            href="#home"
            onClick={(event) => handleAnchorClick(event, "#home")}
            className="flex items-center gap-3"
          >
            <motion.span
              whileHover={{ scale: 1.08, rotate: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-glow"
            >
              <Zap className="h-5 w-5 text-base-950" strokeWidth={2.5} />
            </motion.span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide text-white sm:text-base">
                {t(brand.name)}
              </span>
              <span className="hidden text-[0.65rem] text-slate-400 sm:block">
                {t(brand.tagline)}
              </span>
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {nav.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(event) => handleAnchorClick(event, link.href)}
                className="group relative rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white"
              >
                {t(link.label)}
                <span className="absolute inset-x-3 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-accent-neon to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SlidingTabs
              options={localeTabs}
              activeId={locale}
              onChange={(id) => setLocale(id === "ar" ? "ar" : "en")}
              layoutId="activeTab"
              ariaLabel={t(nav.languageToggle)}
              className="!p-0.5"
            />
            <MagneticButton
              radius={110}
              strength={0.22}
              className="hidden sm:inline-block"
            >
              <a
                href="#contact"
                onClick={(event) => handleAnchorClick(event, "#contact")}
                className="btn-primary !px-5 !py-2.5"
              >
                {t(nav.cta)}
              </a>
            </MagneticButton>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? t(nav.closeMenu) : t(nav.openMenu)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-200 transition-colors hover:border-accent-neon/50 lg:hidden"
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
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-slate-700/60 bg-base-950/95 backdrop-blur-xl lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4"
            >
              {nav.links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={(event) => handleAnchorClick(event, link.href)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.04, duration: 0.3 }}
                  className="rounded-lg px-3 py-3 text-sm text-slate-200 transition-colors hover:bg-slate-800/60 hover:text-white"
                >
                  {t(link.label)}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={(event) => handleAnchorClick(event, "#contact")}
                className="btn-primary mt-2"
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
