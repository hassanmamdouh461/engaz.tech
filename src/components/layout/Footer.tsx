"use client";

import { BrandMark } from "@/components/ui/BrandMark";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";

const { brand, footer } = content;

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-base-950/80 px-5 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white">
                <BrandMark className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold tracking-wide text-white">
                {t(brand.name)}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              {t(footer.summary)}
            </p>
            <ul className="flex flex-wrap gap-2 pt-1">
              {footer.compliance.map((badge) => (
                <li
                  key={badge.en}
                  className="rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-[0.7rem] text-slate-400"
                >
                  {t(badge)}
                </li>
              ))}
            </ul>
          </div>

          {footer.columns.map((column) => (
            <div key={column.id} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-white">{t(column.title)}</h3>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.en}>
                    <a
                      href="#work"
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span dir="ltr">{`© ${year} ${brand.name.en}`}</span> — {t(footer.copyright)}
          </p>
          <p>{t(brand.tagline)}</p>
        </div>
      </div>
    </footer>
  );
}
