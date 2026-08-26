"use client";

import { BrandMark } from "@/components/ui/BrandMark";
import { content } from "@/lib/content";
import { useLocale } from "@/lib/locale-context";

const { brand, footer } = content;

/**
 * Footer columns point at the section that answers them. Without this every link
 * shared one href, which reads to assistive tech as many links with one purpose.
 */
const COLUMN_ANCHORS: Record<string, string> = {
  services: "#services",
  solutions: "#work",
  company: "#contact",
};

/**
 * Some footer entries repeat a nav label verbatim. Two links with the same text
 * must resolve to the same place, or assistive tech reports conflicting purposes,
 * so these take the nav target instead of the column default.
 */
const LINK_ANCHORS = new Map(
  content.nav.links.map((link) => [link.label.en.toLowerCase(), link.href]),
);

function resolveHref(columnId: string, label: string): string {
  return LINK_ANCHORS.get(label.toLowerCase()) ?? COLUMN_ANCHORS[columnId] ?? "#work";
}

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t-4 border-edge bg-surface px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center border-3 border-edge bg-brand-cyan text-black shadow-neo-3">
                <BrandMark className="h-6 w-6" />
              </span>
              <span className="text-lg font-bold tracking-tight text-ink">
                {t(brand.name)}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink/80">
              {t(footer.summary)}
            </p>
            <ul className="flex flex-wrap gap-2 pt-1">
              {footer.compliance.map((badge) => (
                <li
                  key={badge.en}
                  className="border-2 border-edge bg-brand-mint px-2 py-0.5 font-mono text-[0.7rem] font-semibold text-black"
                >
                  {t(badge)}
                </li>
              ))}
            </ul>
          </div>

          {footer.columns.map((column) => (
            <div key={column.id} className="flex flex-col gap-1">
              <h3 className="mb-1 font-mono text-xs font-bold uppercase tracking-widest text-ink">
                {t(column.title)}
              </h3>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.en}>
                    {/* block + py-2 gives each link a ~40px row, tappable on a phone. */}
                    <a
                      href={resolveHref(column.id, link.en)}
                      className="block py-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
                    >
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t-3 border-edge pt-5 font-mono text-xs text-ink/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span dir="ltr">{`© ${year} ${brand.name.en}`}</span> — {t(footer.copyright)}
          </p>
          <p>{t(brand.tagline)}</p>
        </div>
      </div>
    </footer>
  );
}
