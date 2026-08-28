export type Locale = "en" | "ar";

export type Localized = Record<Locale, string>;

export interface NavLink {
  id: string;
  href: string;
  label: Localized;
}

export interface Pillar {
  id: string;
  icon: string;
  title: Localized;
  body: Localized;
}

export interface StatCard {
  id: string;
  value: number;
  prefix?: string;
  suffix: string;
  /** Short label above the number, e.g. the activity the figure measures. */
  caption: Localized;
  label: Localized;
}

export interface ProjectMetric {
  id: string;
  value: Localized;
  label: Localized;
}

export interface FeaturedProject {
  id: string;
  icon: string;
  sector: Localized;
  title: Localized;
  description: Localized;
  metrics: ProjectMetric[];
}

export interface SecondaryProject {
  id: string;
  icon: string;
  title: Localized;
  description: Localized;
  tags: Localized[];
}

export interface EcosystemStage {
  id: string;
  icon: string;
  title: Localized;
  body: Localized;
  nodes: Localized[];
}

export interface Service {
  id: string;
  icon: string;
  title: Localized;
  body: Localized;
}

export interface PartnerTrack {
  id: string;
  title: Localized;
  direction: "forward" | "reverse";
  items: Localized[];
}

export interface ContactChannel {
  id: string;
  icon: string;
  label: Localized;
  value: string;
  href?: string;
}

export interface FooterColumn {
  id: string;
  title: Localized;
  links: Localized[];
}

export interface SiteContent {
  brand: {
    name: Localized;
    tagline: Localized;
  };
  nav: {
    links: NavLink[];
    languageToggle: Localized;
    cta: Localized;
    openMenu: Localized;
    closeMenu: Localized;
  };
  hero: {
    /** Short opener above the headline, rendered with the scramble reveal. */
    greeting: Localized;
    headlineLead: Localized;
    headlineAccent: Localized;
    /** Lines the stroke section wipes through, one per band pass. Needs at least two. */
    strokeLines: Localized[];
    subtitle: Localized;
    primaryCta: Localized;
    secondaryCta: Localized;
    ticker: Localized[];
  };
  pillars: {
    eyebrow: Localized;
    heading: Localized;
    body: Localized;
    items: Pillar[];
  };
  stats: {
    eyebrow: Localized;
    heading: Localized;
    body: Localized;
    cards: StatCard[];
  };
  work: {
    eyebrow: Localized;
    heading: Localized;
    body: Localized;
    featured: FeaturedProject[];
    secondaryHeading: Localized;
    secondary: SecondaryProject[];
  };
  ecosystem: {
    eyebrow: Localized;
    heading: Localized;
    body: Localized;
    stages: EcosystemStage[];
  };
  services: {
    eyebrow: Localized;
    heading: Localized;
    body: Localized;
    items: Service[];
  };
  partners: {
    eyebrow: Localized;
    heading: Localized;
    tracks: PartnerTrack[];
  };
  contact: {
    eyebrow: Localized;
    heading: Localized;
    body: Localized;
    channels: ContactChannel[];
    form: {
      organization: Localized;
      email: Localized;
      emailPlaceholder: Localized;
      phone: Localized;
      phonePlaceholder: Localized;
      sector: Localized;
      sectorPlaceholder: Localized;
      sectorOptions: Localized[];
      scope: Localized;
      scopePlaceholder: Localized;
      message: Localized;
      messagePlaceholder: Localized;
      submit: Localized;
      submitting: Localized;
      success: Localized;
      error: Localized;
      errorEmail: Localized;
      errorSend: Localized;
      /** Uses a {seconds} placeholder for the remaining wait. */
      errorCooldown: Localized;
    };
  };
  footer: {
    summary: Localized;
    columns: FooterColumn[];
    compliance: Localized[];
    copyright: Localized;
  };
}
