import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageFrame } from "@/components/layout/PageFrame";
import { ProgressRail } from "@/components/layout/ProgressRail";
import { PageTransition } from "@/components/providers/PageTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Loader } from "@/components/ui/Loader";
import { content } from "@/lib/content";
import { LocaleProvider } from "@/lib/locale-context";
import { ThemeProvider } from "@/lib/theme-context";
import {
  HREFLANG,
  KEYWORDS,
  LOCALE_PATH,
  OG_LOCALE,
  SITE_URL,
  canonicalFor,
  structuredData,
} from "@/lib/seo";
import type { Locale } from "@/lib/types";

const { brand, footer } = content;

const TITLE: Record<Locale, string> = {
  en: "Engaz — Software, Restaurant Systems & AI Agents",
  ar: "إنجاز — برمجة وأنظمة مطاعم ووكلاء ذكاء اصطناعي",
};

const DESCRIPTION: Record<Locale, string> = {
  en: "Engaz is a software house building restaurant and café POS systems, AI agents and automation, websites, mobile apps, and custom software — delivered fast and supported after launch.",
  ar: "إنجاز شركة برمجيات تبني أنظمة كاشير للمطاعم والكافيهات، ووكلاء ذكاء اصطناعي وأتمتة، ومواقع إلكترونية، وتطبيقات جوال، وبرمجيات مخصصة — تسليم سريع ودعم بعد الإطلاق.",
};

/** `alternates.languages` needs every locale plus the engine-agnostic fallback. */
function languageAlternates() {
  return {
    [HREFLANG.en]: LOCALE_PATH.en,
    [HREFLANG.ar]: LOCALE_PATH.ar,
    "x-default": LOCALE_PATH.en,
  };
}

export function localeMetadata(locale: Locale): Metadata {
  const title = TITLE[locale];
  const description = DESCRIPTION[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${brand.name[locale]}`,
    },
    description,
    keywords: KEYWORDS[locale],
    applicationName: brand.name.en,
    generator: "Next.js",
    authors: [{ name: brand.name.en, url: SITE_URL }],
    creator: brand.name.en,
    publisher: brand.name.en,
    category: "technology",
    alternates: {
      canonical: LOCALE_PATH[locale],
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      siteName: brand.name[locale],
      title,
      description,
      url: canonicalFor(locale),
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[locale === "en" ? "ar" : "en"]],
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${brand.name[locale]} — ${brand.tagline[locale]}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      // Reinforces the subject for engines that read plain meta over JSON-LD.
      "og:see_also": SITE_URL,
      subject: footer.summary[locale],
    },
  };
}

/**
 * Everything inside <body>, shared by both locale routes. The route decides the
 * locale, so the markup a crawler receives is already in the right language.
 */
export function LocaleShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      <ThemeProvider>
        {/* JSON-LD is emitted per route so each URL describes itself in its own language. */}
        <script
          type="application/ld+json"
          // Next escapes the string, and the payload is built from our own content file.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(locale)) }}
        />
        <SmoothScroll>
          <Loader />
          <ProgressRail />
          <a
            href="#home"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:border-3 focus:border-edge focus:bg-brand-yellow focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
          >
            {locale === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content"}
          </a>
          <PageTransition>
            <PageFrame>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </PageFrame>
          </PageTransition>
        </SmoothScroll>
      </ThemeProvider>
    </LocaleProvider>
  );
}
