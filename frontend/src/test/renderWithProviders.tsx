import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeModeProvider } from "../app/theme/ThemeModeProvider";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

type RenderOptions = {
  route?: string;
  withRouter?: boolean;
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions,
) {
  const client = createTestQueryClient();
  const withRouter = options?.withRouter !== false;
  const route = options?.route ?? "/";

  return render(
    <QueryClientProvider client={client}>
      <ThemeModeProvider>
        {withRouter ? (
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        ) : (
          ui
        )}
      </ThemeModeProvider>
    </QueryClientProvider>,
  );
}
