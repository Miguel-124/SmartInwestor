import * as React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type LogoProps = {
  size?: number;
  title?: string;
};

export function Logo({ size = 40, title = "SmartInwestor" }: LogoProps) {
  const theme = useTheme();
  const gradId = React.useId();

  return (
    <Box
      component="span"
      aria-label={title}
      sx={{ display: "inline-flex", width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme.palette.primary.main} />
            <stop offset="100%" stopColor={theme.palette.secondary.main} />
          </linearGradient>
        </defs>

        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="16"
          fill={`url(#${gradId})`}
        />

        <path
          d="M18 40 L28 30 L36 36 L46 22"
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 22 H48 V26"
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="18" cy="40" r="3" fill="white" />
        <circle cx="28" cy="30" r="3" fill="white" />
        <circle cx="36" cy="36" r="3" fill="white" />
        <circle cx="46" cy="22" r="3" fill="white" />
      </svg>
    </Box>
  );
}
