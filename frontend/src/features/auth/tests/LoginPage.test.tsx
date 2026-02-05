import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { LoginPage } from "../pages/LoginPage";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigateMock };
});

const setAuthTokenMock = vi.fn();
vi.mock("../../../shared/auth/tokenStorage", async () => {
  const actual = await vi.importActual<
    typeof import("../../../shared/auth/tokenStorage")
  >("../../../shared/auth/tokenStorage");
  return { ...actual, setAuthToken: (t: string) => setAuthTokenMock(t) };
});

describe("LoginPage", () => {
  it("waliduje wymagane pola", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Zaloguj" }));

    expect(await screen.findByText("Email jest wymagany")).toBeInTheDocument();
    expect(await screen.findByText("Hasło jest wymagane")).toBeInTheDocument();
  });

  it("loguje i zapisuje token oraz nawiguję na /dashboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "jan@example.com");
    await user.type(screen.getByLabelText("Hasło"), "strong-password-1!");

    await user.click(screen.getByRole("button", { name: "Zaloguj" }));

    expect(setAuthTokenMock).toHaveBeenCalledWith("mock-token-123");
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });
});
