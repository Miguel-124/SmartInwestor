import { describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { ProfileSettingsPage } from "../pages/ProfileSettingsPage";

beforeEach(() => {
  localStorage.setItem("smartinwestor_token", "test-token");
});

describe("ProfileSettingsPage", () => {
  it("renderuje dane profilu z API", async () => {
    renderWithProviders(<ProfileSettingsPage />);

    expect(await screen.findByDisplayValue("Oskar")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Brózda")).toBeInTheDocument();
    expect(screen.getByDisplayValue("oskar@gmail.com")).toBeInTheDocument();
  });

  it("pozwala zapisać zmiany profilu", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfileSettingsPage />);

    await screen.findByDisplayValue("Oskar");

    await user.clear(screen.getByLabelText("Imię"));
    await user.type(screen.getByLabelText("Imię"), "Jan");

    await user.clear(screen.getByLabelText("Data urodzenia"));
    await user.type(screen.getByLabelText("Data urodzenia"), "1990-01-01");

    await user.click(screen.getByRole("radio", { name: /Agresywny/ }));

    await user.click(
      await screen.findByLabelText(
        "Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje.",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Zapisz zmiany" }));

    await waitFor(() => {
      expect(screen.getByText("Zapisano zmiany profilu.")).toBeInTheDocument();
    });
  });
});
