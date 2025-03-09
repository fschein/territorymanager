"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeProviderContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => "system",
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  props?: unknown;
}) {
  // Inicializa o estado com defaultTheme (evita erro no SSR)
  const [theme, setTheme] = useState<string>(defaultTheme);

  // Carrega o tema do localStorage apenas no cliente
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const appliedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.add(appliedTheme);
    document.body.classList.toggle("theme-dark", appliedTheme === "dark");
    document.body.classList.toggle("theme-light", appliedTheme === "light");
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: string) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
