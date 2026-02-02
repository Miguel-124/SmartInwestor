import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeModeProvider } from "./theme/ThemeModeProvider";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>{children}</ThemeModeProvider>
    </QueryClientProvider>
  );
}
