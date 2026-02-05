import { createTheme, type Theme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { brandTokens } from "./tokens";

export function createAppTheme(mode: PaletteMode): Theme {
  const isDark = mode === "dark";

  return createTheme({
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: [
        "Inter",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Arial",
        "sans-serif",
      ].join(","),
    },
    palette: {
      mode,
      primary: { main: brandTokens.primary },
      secondary: { main: brandTokens.secondary },
      background: {
        default: isDark ? "#0b1220" : "#f8fafc",
        paper: isDark ? "#0f172a" : "#ffffff",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? 'url("/assets/bg_dark.jpg")'
              : 'url("/assets/bg_light.jpg")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          },
          "#root": {
            minHeight: "100vh",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}
