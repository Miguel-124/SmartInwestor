import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { AppFooter } from "../shared/UI/AppFooter";
import { AppPublicHeader } from "../shared/UI/AppPublicHeader";
import { AppPrivateHeader } from "../shared/UI/AppPrivateHeader";
import { getAuthToken } from "../shared/auth/tokenStorage";

export function PublicLayout() {
  const isAuthed = Boolean(getAuthToken());

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {isAuthed ? <AppPrivateHeader /> : <AppPublicHeader />}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <AppFooter />
    </Box>
  );
}
