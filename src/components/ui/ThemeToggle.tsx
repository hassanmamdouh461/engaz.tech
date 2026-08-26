"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLocale } from "@/lib/locale-context";

const LABEL = {
  en: { toDark: "Switch to dark theme", toLight: "Switch to light theme" },
  ar: { toDark: "التبديل إلى الوضع الداكن", toLight: "التبديل إلى الوضع الفاتح" },
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { locale } = useLocale();

  const label = theme === "light" ? LABEL[locale].toDark : LABEL[locale].toLight;

  return (
    <button type="button" onClick={toggleTheme} aria-label={label} className="neo-icon-btn">
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
