import { test, expect } from "@playwright/test";

test("ochrona tras prywatnych przekierowuje na logowanie", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.removeItem("smartinwestor_token"),
  );
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("publiczny 404 dla nieistniejącej ścieżki", async ({ page }) => {
  await page.goto("/nie-istnieje");
  await expect(page.getByText("404")).toBeVisible();
});

test("nieistniejąca ścieżka /dashboard/xyz pokazuje stronę 404", async ({
  page,
}) => {
  await page.goto("/dashboard/xyz");

  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("strony legal: regulamin i polityka prywatności", async ({ page }) => {
  await page.goto("/terms");
  await expect(
    page.getByRole("heading", { name: "Regulamin", exact: true }),
  ).toBeVisible();

  await page.goto("/privacy-policy");
  await expect(
    page.getByRole("heading", { name: "Polityka prywatności", exact: true }),
  ).toBeVisible();
});
