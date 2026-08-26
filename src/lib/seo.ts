import { content } from "./content";
import type { Locale } from "./types";

export const SITE_URL = "https://engaz.tech";

export const LOCALE_PATH: Record<Locale, string> = {
  en: "/",
  ar: "/ar/",
};

/** BCP-47 tags for hreflang. Arabic is targeted at Egypt, where the business operates. */
export const HREFLANG: Record<Locale, string> = {
  en: "en",
  ar: "ar-EG",
};

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_EG",
};

export function canonicalFor(locale: Locale): string {
  return `${SITE_URL}${LOCALE_PATH[locale]}`;
}

/**
 * Search terms the business should be findable by, in both languages. Google ignores
 * the keywords meta tag, so this list exists to keep the phrasing in one place: it
 * feeds the meta tag for the engines that still read it, and doubles as the checklist
 * the visible copy and structured data are written against.
 */
export const KEYWORDS: Record<Locale, string[]> = {
  ar: [
    "إنجاز",
    "شركة برمجة",
    "شركة برمجيات",
    "شركة تصميم مواقع",
    "تصميم موقع الكتروني",
    "برمجة مواقع",
    "تصميم مواقع مصر",
    "شركة برمجة في مصر",
    "شركة سوفت وير",
    "تطوير تطبيقات",
    "برمجة تطبيقات",
    "تصميم تطبيقات موبايل",
    "تطبيقات اندرويد",
    "تطبيقات ايفون",
    "نظام مطاعم",
    "برنامج مطاعم",
    "برنامج كاشير",
    "نظام كاشير للمطاعم",
    "كاشير مطاعم وكافيهات",
    "نظام نقاط بيع",
    "برنامج نقاط البيع",
    "نظام ادارة مطاعم",
    "برنامج ادارة كافيه",
    "نظام كافيهات",
    "شاشة مطبخ",
    "نظام طلبات المطاعم",
    "برنامج مخزون مطاعم",
    "منيو الكتروني",
    "قائمة طعام الكترونية",
    "نظام حجز طاولات",
    "الذكاء الاصطناعي",
    "وكيل ذكاء اصطناعي",
    "شات بوت",
    "شات بوت واتساب",
    "روبوت محادثة",
    "اتمتة الاعمال",
    "حلول ذكاء اصطناعي للشركات",
    "وكالة ذكاء اصطناعي",
    "متجر الكتروني",
    "تصميم متجر الكتروني",
    "تجارة الكترونية",
    "موقع تعريفي",
    "موقع شركة",
    "لوحة تحكم",
    "برمجة انظمة ادارة",
    "برمجيات مخصصة",
    "استضافة مواقع",
    "صيانة مواقع",
    "تصميم واجهات المستخدم",
    "حلول برمجية ذكية",
  ],
  en: [
    "Engaz",
    "engaz.tech",
    "software company",
    "software house Egypt",
    "software development company",
    "custom software development",
    "web development company",
    "website design",
    "website development Egypt",
    "web application development",
    "mobile app development",
    "Android app development",
    "iOS app development",
    "Flutter development",
    "React Native development",
    "Next.js development",
    "restaurant management system",
    "restaurant POS system",
    "cafe POS system",
    "point of sale software",
    "cafe management software",
    "kitchen display system",
    "restaurant ordering system",
    "restaurant inventory software",
    "digital menu",
    "QR menu",
    "table booking system",
    "AI agency",
    "AI agents",
    "AI automation",
    "chatbot development",
    "WhatsApp chatbot",
    "business process automation",
    "generative AI solutions",
    "ecommerce website",
    "online store development",
    "showcase website",
    "company website",
    "admin dashboard development",
    "SaaS development",
    "API development",
    "hosting and maintenance",
    "UI UX design",
    "smart software solutions",
  ],
};

const SERVICE_KEYWORDS: Record<Locale, string> = {
  en: "restaurant systems, AI agents, websites, mobile apps, custom software",
  ar: "أنظمة المطاعم، وكلاء الذكاء الاصطناعي، المواقع، تطبيقات الجوال، برمجيات مخصصة",
};

const AREA_SERVED = ["EG", "SA", "AE", "KW", "QA"];

/**
 * Organization plus WebSite plus the service catalogue, as one graph so the nodes can
 * reference each other. Search engines read this to build the knowledge panel and the
 * sitelinks search box, and it is where the service wording is stated machine-readably.
 */
export function structuredData(locale: Locale) {
  const { brand, services, contact, footer } = content;
  const url = canonicalFor(locale);
  const organizationId = `${SITE_URL}/#organization`;

  const phone = contact.channels.find((channel) => channel.id === "phone");
  const email = contact.channels.find((channel) => channel.id === "email");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": organizationId,
        name: brand.name[locale],
        alternateName: [brand.name.en, brand.name.ar, "Engaz Tech"],
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        image: `${SITE_URL}/og.png`,
        slogan: brand.tagline[locale],
        description: footer.summary[locale],
        knowsAbout: KEYWORDS[locale].slice(0, 25),
        knowsLanguage: ["ar", "en"],
        areaServed: AREA_SERVED.map((code) => ({ "@type": "Country", name: code })),
        address: { "@type": "PostalAddress", addressCountry: "EG" },
        ...(phone ? { telephone: phone.value } : {}),
        ...(email ? { email: email.value.replace(/^mailto:/, "") } : {}),
        contactPoint: contact.channels
          .filter((channel) => channel.id === "phone" || channel.id === "whatsapp")
          .map((channel) => ({
            "@type": "ContactPoint",
            telephone: channel.value,
            contactType: "customer support",
            availableLanguage: ["ar", "en"],
          })),
        sameAs: contact.channels
          .map((channel) => channel.href)
          .filter((href): href is string => Boolean(href?.startsWith("https://"))),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: services.heading[locale],
          itemListElement: services.items.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title[locale],
              description: service.body[locale],
              serviceType: service.title[locale],
              provider: { "@id": organizationId },
              areaServed: AREA_SERVED.map((code) => ({ "@type": "Country", name: code })),
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: brand.name[locale],
        description: footer.summary[locale],
        publisher: { "@id": organizationId },
        inLanguage: HREFLANG[locale],
        keywords: SERVICE_KEYWORDS[locale],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${brand.name[locale]} — ${brand.tagline[locale]}`,
        description: footer.summary[locale],
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": organizationId },
        inLanguage: HREFLANG[locale],
      },
    ],
  };
}
