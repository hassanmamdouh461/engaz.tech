/** Remembers the curtain already played this session (new tab = new session). */
export const INTRO_KEY = "engaz.intro-seen";

/**
 * Runs before first paint, like ThemeScript. Returning visitors must never see
 * the intro curtain again, but the Loader can
 * only find that out in an effect, which runs after paint — so the curtain used
 * to flash for a frame on every locale switch. This marks <html> up front and
 * globals.css hides [data-loader] while the mark is present.
 */
export function IntroScript() {
  const script = `(function(){try{if(sessionStorage.getItem("${INTRO_KEY}")==="1"){document.documentElement.setAttribute("data-intro","skip");}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
