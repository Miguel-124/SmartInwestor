import React from "react";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { createAppTheme } from "./createAppTheme";

type ThemeModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
};

const ThemeModeContext = React.createContext<ThemeModeContextValue | null>(
  null,
);

const STORAGE_KEY = "smartinwestor_theme_mode";

function readStoredMode(): PaletteMode | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "light" || raw === "dark") return raw;
  return null;
}

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setModeState] = React.useState<PaletteMode>(() => {
    const stored = readStoredMode();
    if (stored) return stored;
    return prefersDark ? "dark" : "light";
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = React.useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode: () => setModeState((m) => (m === "light" ? "dark" : "light")),
      setMode: (m) => setModeState(m),
    }),
    [mode],
  );

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeMode(): ThemeModeContextValue {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return ctx;
}
