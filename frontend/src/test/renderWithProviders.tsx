import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";
import { ThemeModeProvider } from "../app/theme/ThemeModeProvider";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(ui: React.ReactElement) {
  const client = createTestQueryClient();

  return render(
    <QueryClientProvider client={client}>
      <ThemeModeProvider>{ui}</ThemeModeProvider>
    </QueryClientProvider>,
  );
}
