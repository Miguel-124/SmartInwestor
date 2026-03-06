import { test, expect } from "@playwright/test";
import { setAuthToken } from "./helpers/auth";

test("dashboard renderuje kluczowe sekcje", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/dashboard");

  await expect(page.getByText(/Witaj,/)).toBeVisible();
  await expect(page.getByLabel("Wykres kołowy portfeli")).toBeVisible();
  await expect(
    page.getByLabel("Wykres liniowy wartości aktywów"),
  ).toBeVisible();
  await expect(page.getByLabel("Tabela portfeli i aktywów")).toBeVisible();
});

test("dashboard link pomocy prowadzi do instrukcji", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/dashboard");

  await page.getByRole("link", { name: "Instrukcja dashboardu" }).click();
  await expect(page).toHaveURL(/\/profile\/help#instrukcja-dashboard$/);
});
