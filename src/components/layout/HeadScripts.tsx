import { IntroScript } from "@/lib/intro-script";
import { ThemeScript } from "@/lib/theme-context";

/**
 * Scroll locked until hydration wires the scroll-driven pins — scrolling into the
 * pin range before the trigger exists makes ScrollTrigger yank the page back up
 * when it mounts. SmoothScroll unlocks on mount; the timeout is a failsafe if
 * hydration never completes.
 */
const SCROLL_LOCK =
  "document.documentElement.style.overflow='hidden';setTimeout(function(){document.documentElement.style.overflow=''},5000)";

/**
 * Without JavaScript nothing would ever undo the scroll lock or play the entrance
 * reveals, whose hidden first frame Framer writes into the HTML as inline
 * opacity/transform — so the page would be frozen with most sections invisible.
 */
const NO_SCRIPT_CSS =
  'html{overflow:auto !important}[style*="opacity:0"]{opacity:1 !important;transform:none !important}';

/**
 * Pre-paint scripts shared by both locale root layouts. They add data-theme,
 * data-intro and an inline overflow lock to <html> before React hydrates, which
 * is why the layouts set suppressHydrationWarning on it.
 */
export function HeadScripts() {
  return (
    <>
      <ThemeScript />
      <IntroScript />
      <script dangerouslySetInnerHTML={{ __html: SCROLL_LOCK }} />
      <noscript>
        <style>{NO_SCRIPT_CSS}</style>
      </noscript>
    </>
  );
}
