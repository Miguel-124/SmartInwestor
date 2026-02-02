import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { DashboardPage } from "../pages/DashboardPage";

describe("DashboardPage", () => {
  it("renders greeting and charts/table", async () => {
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText(/Witaj,/)).toBeInTheDocument();
    expect(screen.getByLabelText("Wykres kołowy portfeli")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Wykres liniowy wartości aktywów"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Tabela portfeli i aktywów"),
    ).toBeInTheDocument();
  });
});
