import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { RegisterPage } from "../pages/RegisterPage";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigateMock };
});

describe("RegisterPage", () => {
  it("blokuje submit przy błędnym haśle i braku dopasowania confirm", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText("Imię"), "Jan");
    await user.type(screen.getByLabelText("Nazwisko"), "Kowalski");
    await user.type(screen.getByLabelText("Email"), "jan@example.com");
    await user.type(screen.getByLabelText("Hasło"), "abcdefghi"); // brak cyfry i znaku
    await user.type(screen.getByLabelText("Potwierdź hasło"), "abcd");

    await user.click(screen.getByRole("button", { name: "Zarejestruj" }));

    expect(
      await screen.findByText("Hasło musi zawierać co najmniej jedną cyfrę"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Hasła muszą być takie same"),
    ).toBeInTheDocument();
  });

  it("po poprawnej rejestracji przechodzi na /onboarding", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText("Imię"), "Jan");
    await user.type(screen.getByLabelText("Nazwisko"), "Kowalski");
    await user.type(screen.getByLabelText("Email"), "jan@example.com");
    await user.type(screen.getByLabelText("Hasło"), "Strongpass1!");
    await user.type(screen.getByLabelText("Potwierdź hasło"), "Strongpass1!");

    await user.click(screen.getByRole("button", { name: "Zarejestruj" }));

    expect(navigateMock).toHaveBeenCalledWith("/onboarding");
  });
});
