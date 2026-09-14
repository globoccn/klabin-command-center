import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "klabin-dashboard-theme";
type AppTheme = "light" | "dark";

function readTheme(): AppTheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // O tema continua funcional mesmo quando o storage está bloqueado.
  }
}

export function ThemeToggle({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const [theme, setTheme] = useState<AppTheme>("light");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const nextTheme: AppTheme = theme === "dark" ? "light" : "dark";
  const label = nextTheme === "light" ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      type="button"
      className={variant === "mobile" ? "mobile-theme-toggle" : "sidebar-theme-toggle"}
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
