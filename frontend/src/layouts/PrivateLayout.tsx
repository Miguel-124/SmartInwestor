import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { AppPrivateHeader } from "../shared/UI/AppPrivateHeader";
import { AppFooter } from "../shared/UI/AppFooter";

export function PrivateLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppPrivateHeader />
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <AppFooter />
    </Box>
  );
}
