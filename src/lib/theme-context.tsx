"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "engaz.theme";

/** Void colours from globals.css, so mobile browser chrome tracks the real theme. */
const THEME_COLOR: Record<Theme, string> = { light: "#d0d0d0", dark: "#0a0a0a" };

function syncThemeColor(theme: Theme) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * `data-theme` on <html> is written by an inline script before paint (see
 * `ThemeScript`), so this provider only has to read back what is already there.
 * Initialising from state instead would flash the light theme on every load.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Read what ThemeScript already painted. The lazy initializer only touches the
  // DOM on the client; consumers that render differently per theme must gate the
  // difference behind useMounted() so hydration output matches the server.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") {
      return "light";
    }
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  });

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      syncThemeColor(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private browsing can reject writes; the theme still applies for this page.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}

/**
 * Runs before first paint so no themed pixel is painted with the wrong palette.
 *
 * Light is the default regardless of the visitor's OS setting: this design is built
 * on black ink and offset shadows over paper, and that is the intended first
 * impression. Anyone who prefers dark can switch, and the choice is remembered.
 */
export function ThemeScript() {
  const script = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}")==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",s);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",s==="dark"?"${THEME_COLOR.dark}":"${THEME_COLOR.light}");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
