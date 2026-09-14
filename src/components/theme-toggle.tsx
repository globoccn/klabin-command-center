import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "klabin-dashboard-theme";
type AppTheme = "light" | "dark";

function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const [theme, setTheme] = useState<AppTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial: AppTheme = stored === "dark" || stored === "light" ? stored : "light";
    setTheme(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, ready]);

  const light = theme === "light";
  return (
    <button
      type="button"
      className={variant === "mobile" ? "mobile-theme-toggle" : "sidebar-theme-toggle"}
      onClick={() => setTheme(light ? "dark" : "light")}
      aria-label={light ? "Ativar tema escuro" : "Ativar tema claro"}
      title={light ? "Ativar tema escuro" : "Ativar tema claro"}
    >
      {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
