import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ProfileNav } from "./ProfileNav";

type ProfileShellProps = {
  title: string;
  children: React.ReactNode;
};

export function ProfileShell({ title, children }: ProfileShellProps) {
  return (
    <Stack spacing={3} aria-label={`Profil - ${title}`}>
      <Typography variant="h4" sx={{ fontWeight: 900 }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <ProfileNav />
        <Box>{children}</Box>
      </Box>
    </Stack>
  );
}
