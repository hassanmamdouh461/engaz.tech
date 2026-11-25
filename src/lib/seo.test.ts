import { describe, expect, it } from "vitest";
import { HREFLANG, SITE_URL, canonicalFor, structuredData } from "./seo";

describe("canonicalFor", () => {
  it("points each locale at its own route, with the trailing slash the export serves", () => {
    expect(canonicalFor("en")).toBe(`${SITE_URL}/`);
    expect(canonicalFor("ar")).toBe(`${SITE_URL}/ar/`);
  });
});

describe("structuredData", () => {
  const graph = structuredData("ar")["@graph"];
  const organization = graph[0] as Record<string, unknown>;

  it("emits one organization, website and page node, linked by id", () => {
    expect(graph.map((node) => node["@type"])).toEqual([
      ["Organization", "ProfessionalService"],
      "WebSite",
      "WebPage",
    ]);
    expect(graph[1].publisher).toEqual({ "@id": organization["@id"] });
  });

  it("tags the page with the locale's hreflang", () => {
    expect(graph[2].inLanguage).toBe(HREFLANG.ar);
  });

  it("keeps direct-contact links out of sameAs, which is for profiles only", () => {
    const sameAs = organization.sameAs as string[];
    for (const href of sameAs) {
      expect(href.startsWith("https://")).toBe(true);
      expect(href).not.toMatch(/^https:\/\/(wa\.me|api\.whatsapp\.com)/);
      expect(href.startsWith(SITE_URL)).toBe(false);
    }
  });

  it("gives the email as a bare address, not a mailto: link", () => {
    expect(organization.email).not.toMatch(/^mailto:/);
  });
});
