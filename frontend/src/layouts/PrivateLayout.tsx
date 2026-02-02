import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { AppHeader } from "../shared/ui/AppHeader";
import { AppFooter } from "../shared/ui/AppFooter";

export function PrivateLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <AppFooter />
    </Box>
  );
}
