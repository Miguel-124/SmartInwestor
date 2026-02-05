import { Box } from "@mui/material";

type LogoProps = {
  size?: number;
  width?: number;
  height?: number;
  radius?: number;
  title?: string;
};

export function Logo({
  size = 40,
  width,
  height,
  radius,
  title = "SmartInwestor",
}: LogoProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const resolvedRadius =
    radius ?? Math.round(Math.min(resolvedWidth, resolvedHeight) * 0.02);

  return (
    <Box
      component="span"
      aria-label={title}
      sx={{
        display: "inline-flex",
        width: resolvedWidth,
        height: resolvedHeight,
      }}
    >
      <Box
        component="img"
        src="/assets/logo.jpg"
        alt={title}
        width={resolvedWidth}
        height={resolvedHeight}
        sx={{
          display: "block",
          objectFit: "contain",
          borderRadius: resolvedRadius,
        }}
      />
    </Box>
  );
}
