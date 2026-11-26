/**
 * Renders the Open Graph share cards (1200×630), one per page and locale, into
 * public/og/{locale}-{page}.png.
 *
 * The site has no image pipeline, so the cards are generated once and committed.
 * Each card is real HTML set in the site's own fonts (Arabic shaping included)
 * and screenshotted with a local headless Chrome or Edge.
 *
 *   node scripts/make-og.mjs
 *
 * Re-run it after changing a page heading in src/data/content.json.
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

// Async, not execFileSync: the card server below runs in this same process and
// must keep answering while the browser loads the page.
const run = promisify(execFile);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(join(root, "src/data/content.json"), "utf8"));
const outDir = join(root, "public/og");
mkdirSync(outDir, { recursive: true });

const BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const browser = BROWSERS.find((path) => existsSync(path));
if (!browser) throw new Error("No Chrome/Edge found; set CHROME_PATH.");

const FONTS = {
  "geist.woff2": "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  "geist-mono.woff2":
    "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  "alexandria.woff2":
    "@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2",
  "plex.woff2":
    "@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2",
};

const { hero, posPage, servicePages, contact, brand, ui } = content;
// The number a card's viewer can message straight from the shared image.
const whatsapp = contact.channels.find((c) => c.id === "whatsapp")?.value ?? "";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Per page: the small label and the headline (with an optional marked accent). */
const PAGES = {
  home: (l) => ({
    label: brand.tagline[l],
    lead: hero.headlineLead[l],
    accent: hero.headlineAccent[l],
  }),
  pos: (l) => ({ label: ui.nav.pos[l], lead: posPage.heading[l] }),
  "ai-agents": (l) => ({
    label: ui.nav.aiAgents[l],
    lead: servicePages.aiAgents.heading[l],
  }),
  websites: (l) => ({
    label: ui.nav.websites[l],
    lead: servicePages.websites.heading[l],
  }),
  "mobile-apps": (l) => ({
    label: ui.nav.mobileApps[l],
    lead: servicePages.mobileApps.heading[l],
  }),
  contact: (l) => ({ label: ui.nav.contact[l], lead: contact.heading[l] }),
};

const MARK = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9 L4 16 L9 23"/><path d="M23 9 L28 16 L23 23"/><path d="M12.5 16.5 L15.5 19.5 L20 12"/></svg>`;

function card(locale, page) {
  const { label, lead, accent } = PAGES[page](locale);
  const ar = locale === "ar";
  const headline = accent
    ? `${esc(lead)} <span class="mark">${esc(accent)}</span>`
    : esc(lead);
  return `<!doctype html>
<html lang="${ar ? "ar" : "en"}" dir="${ar ? "rtl" : "ltr"}"><head><meta charset="utf-8">
<style>
@font-face{font-family:Geist;src:url(/fonts/geist.woff2) format("woff2");font-weight:100 900}
@font-face{font-family:GeistMono;src:url(/fonts/geist-mono.woff2) format("woff2");font-weight:100 900}
@font-face{font-family:Alexandria;src:url(/fonts/alexandria.woff2) format("woff2");font-weight:100 900}
@font-face{font-family:Plex;src:url(/fonts/plex.woff2) format("woff2");font-weight:600}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:#f4f4f0;color:#0a0a0a;font-family:Geist,Plex,sans-serif;position:relative}
.col{position:absolute;inset:0 64px;border-inline:1.5px solid rgb(10 10 10/.12)}
.ghost{position:absolute;inset-inline-end:-40px;bottom:-90px;width:440px;height:440px;color:rgb(10 10 10/.06)}
.wrap{position:absolute;inset:0 64px;padding:56px 56px 48px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:18px;font:700 40px/1 Geist,Alexandria;letter-spacing:-.02em}
.tile{width:72px;height:72px;padding:14px;border:3px solid #0a0a0a;background:#ffd93d;box-shadow:5px 5px 0 #0a0a0a;display:flex}
.tile svg{width:100%;height:100%}
.label{font:600 22px/1 ${ar ? "Plex" : "GeistMono"};${ar ? "" : "text-transform:uppercase;letter-spacing:.12em;"}border:2px solid #0a0a0a;padding:10px 16px;background:#fff}
h1{margin-top:auto;max-width:960px;font:650 ${ar ? "70px/1.35" : "74px/1.06"} Geist,Alexandria;letter-spacing:${ar ? "0" : "-.03em"}}
.mark{background:#ffd93d;padding:0 10px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.bottom{margin-top:40px;padding-top:22px;border-top:2px solid #0a0a0a;display:flex;justify-content:space-between;font:600 24px/1 GeistMono,Plex}
.bottom span:last-child{opacity:.6}
</style></head><body>
<div class="col"></div>
<div class="ghost">${MARK}</div>
<div class="wrap">
  <div class="top">
    <div class="brand"><span class="tile">${MARK}</span>${esc(brand.name[locale])}</div>
    <span class="label">${esc(label)}</span>
  </div>
  <h1>${headline}</h1>
  <div class="bottom"><span dir="ltr">engaz.tech</span><span dir="ltr">WhatsApp ${esc(whatsapp)}</span></div>
</div>
</body></html>`;
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname.startsWith("/fonts/")) {
    const file = FONTS[url.pathname.slice(7)];
    if (!file) return res.writeHead(404).end();
    res.writeHead(200, { "Content-Type": "font/woff2" });
    return res.end(readFileSync(join(root, "node_modules", file)));
  }
  const [, locale, page] = url.pathname.split("/");
  if (!PAGES[page] || !["en", "ar"].includes(locale)) return res.writeHead(404).end();
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(card(locale, page));
});

await new Promise((resolve) => server.listen(0, resolve));
const { port } = server.address();

try {
  for (const locale of ["en", "ar"]) {
    for (const page of Object.keys(PAGES)) {
      const out = join(outDir, `${locale}-${page}.png`);
      await run(browser, [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,630",
        "--virtual-time-budget=3000",
        `--screenshot=${out}`,
        `http://localhost:${port}/${locale}/${page}`,
      ]);
      console.log("wrote", out);
    }
  }
} finally {
  server.close();
}
