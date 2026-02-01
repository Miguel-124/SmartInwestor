import React, { createContext, useContext, useMemo, useState } from "react";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";
import type { ThemeType } from "./types";

type Mode = "light" | "dark";
type ThemeCtx = {
  colors: any;
  theme: ThemeType;
  mode: Mode;
  setMode: (m: Mode) => void;
};

const ThemeContext = createContext<ThemeCtx>({
  theme: lightTheme,
  mode: "light",
  colors: lightTheme.colors,
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const value = useMemo(
    () => ({ theme, mode, setMode, colors: theme.colors }),
    [theme, mode],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
