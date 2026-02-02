import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "../../test/renderWithProviders";
import { PublicNotFoundPage } from "../pages/PublicNotFoundPage";
import { PrivateNotFoundPage } from "../pages/PrivateNotFoundPage";

describe("NotFound pages", () => {
  it("renders public 404", () => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/cos-nie-istnieje"]}>
        <PublicNotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Ścieżka:/)).toBeInTheDocument();
  });

  it("renders private 404", () => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/dashboard/xyz"]}>
        <PrivateNotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Nie znaleziono strony")).toBeInTheDocument();
    expect(screen.getByText(/Nie ma takiej ścieżki:/)).toBeInTheDocument();
  });
});
