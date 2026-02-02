import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { PortfoliosPage } from "../pages/PortfoliosPage";

beforeEach(() => {
  localStorage.setItem("smartinwestor_token", "test-token");
});

describe("PortfoliosPage", () => {
  it("renders and allows adding a portfolio", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PortfoliosPage />);

    expect(await screen.findByText("Portfele")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dodaj portfel" }));
    expect(screen.getByLabelText("portfolio-dialog")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Nazwa portfela"), "Nowy portfel");
    await user.click(screen.getByRole("button", { name: "Dodaj" }));

    expect(await screen.findByText("Nowy portfel")).toBeInTheDocument();
  });
});
