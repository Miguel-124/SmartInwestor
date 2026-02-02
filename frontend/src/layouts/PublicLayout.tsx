import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Outlet />
    </Box>
  );
}
