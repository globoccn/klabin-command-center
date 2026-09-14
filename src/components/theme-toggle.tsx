import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "klabin-dashboard-theme";

type AppTheme = "light" | "dark";

function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<AppTheme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial: AppTheme = stored === "dark" || stored === "light" ? stored : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const nextTheme: AppTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className="theme-toggle-floating"
      onClick={() => setTheme(nextTheme)}
      aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
      title={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
    >
      <span className="theme-toggle-floating__icon">
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <span className="theme-toggle-floating__label">{theme === "light" ? "Escuro" : "Claro"}</span>
    </button>
  );
}
