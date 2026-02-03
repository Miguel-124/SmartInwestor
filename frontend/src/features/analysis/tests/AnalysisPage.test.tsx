import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { AnalysisPage } from "../pages/AnalysisPage";

beforeEach(() => {
  localStorage.setItem("smartinwestor_token", "test-token");
});

describe("AnalysisPage", () => {
  it("renderuje widok analizy z rekomendacjami", async () => {
    renderWithProviders(<AnalysisPage />);

    expect(await screen.findByText("Analiza portfela")).toBeInTheDocument();
    expect(screen.getByText("Rekomendacje")).toBeInTheDocument();
    expect(screen.getByText("Ekspozycja portfela")).toBeInTheDocument();
    expect(screen.getByText("Symulacje stress test")).toBeInTheDocument();
  });
});
