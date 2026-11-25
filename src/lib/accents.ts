/**
 * The four accents that rotate across cards, notes, stripes and highlights. The
 * class names are spelled out in full so Tailwind's scanner finds them.
 */
export type Accent = "cyan" | "yellow" | "pink" | "mint";

export const ACCENT_BG: Record<Accent, string> = {
  cyan: "bg-brand-cyan",
  yellow: "bg-brand-yellow",
  pink: "bg-brand-pink",
  mint: "bg-brand-mint",
};

export const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "text-brand-cyan",
  yellow: "text-brand-yellow",
  pink: "text-brand-pink",
  mint: "text-brand-mint",
};

const CYCLE: Accent[] = ["cyan", "yellow", "pink", "mint"];

/** The accent cycles by position so a grid never shows two identical tones side by side. */
export function accentAt(index: number): Accent {
  return CYCLE[index % CYCLE.length];
}
