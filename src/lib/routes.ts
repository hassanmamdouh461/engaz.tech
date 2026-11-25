import { content } from "./content";
import { LOCALE_PATH, SITE_URL } from "./seo";
import type { Locale, Localized } from "./types";

export type Page = "home" | "pos" | "ai-agents" | "websites" | "mobile-apps" | "contact";

/** Every page exists in both locales; the sitemap and language switch walk this list. */
export const PAGES: Page[] = [
  "home",
  "pos",
  "ai-agents",
  "websites",
  "mobile-apps",
  "contact",
];

const SEGMENT: Record<Page, string> = {
  home: "",
  pos: "pos/",
  "ai-agents": "ai-agents/",
  websites: "websites/",
  "mobile-apps": "mobile-apps/",
  contact: "contact/",
};

/** Site-relative URL of a page in a locale, always with the trailing slash. */
export function pathFor(locale: Locale, page: Page): string {
  return `${LOCALE_PATH[locale]}${SEGMENT[page]}`;
}

export function absoluteUrl(locale: Locale, page: Page): string {
  return `${SITE_URL}${pathFor(locale, page)}`;
}

const whatsapp = content.contact.channels.find((channel) => channel.id === "whatsapp");

/**
 * wa.me link with the page's own pre-filled text, so a lead that arrives on
 * WhatsApp shows which page it came from.
 */
export function whatsappHref(message: Localized, locale: Locale): string {
  const base = whatsapp?.href ?? "https://wa.me/201125377606";
  return `${base}?text=${encodeURIComponent(message[locale])}`;
}
