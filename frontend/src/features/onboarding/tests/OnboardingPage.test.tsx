import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { OnboardingPage } from "../pages/OnboardingPage";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigateMock };
});

describe("OnboardingPage", () => {
  it("blokuje submit dla niepełnoletniego", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OnboardingPage />);

    await user.type(screen.getByLabelText("Data urodzenia"), "2010-01-01");
    await user.click(screen.getByLabelText("Ostrożny"));
    await user.click(
      screen.getByLabelText(
        "Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje.",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Zapisz onboarding" }));

    expect(
      await screen.findByText("Musisz mieć ukończone 18 lat"),
    ).toBeInTheDocument();
  });

  it("po poprawnym onboardingu przechodzi na /login", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OnboardingPage />);

    await user.type(screen.getByLabelText("Data urodzenia"), "1990-01-01");
    await user.click(screen.getByLabelText("Zrównoważony"));
    await user.click(
      screen.getByLabelText(
        "Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje.",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Zapisz onboarding" }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });
});
