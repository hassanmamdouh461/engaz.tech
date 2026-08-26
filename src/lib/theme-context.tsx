"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "engaz.theme";

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
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    setTheme(attr === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
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
  const script = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");document.documentElement.setAttribute("data-theme",s==="dark"?"dark":"light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
