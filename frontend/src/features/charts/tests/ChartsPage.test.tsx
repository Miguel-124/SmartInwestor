import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChartsPage } from "../pages/ChartsPage";

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/charts"]}>
        <Routes>
          <Route path="/charts" element={<ChartsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("ChartsPage", () => {
  it("renders header and controls", async () => {
    renderPage();

    expect(await screen.findByText("Wykresy")).toBeInTheDocument();
    expect(screen.getByLabelText("Zakres wykresu")).toBeInTheDocument();
    expect(screen.getByLabelText("Liczba punktów")).toBeInTheDocument();
  });
});
