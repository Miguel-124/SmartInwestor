import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { AppFooter } from "../shared/UI/AppFooter";

export function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <AppFooter />
    </Box>
  );
}
