import { test, expect } from "@playwright/test";
import { setAuthToken } from "./helpers/auth";

test("wykresy: widok i kontrolki", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/charts");

  await expect(
    page.getByRole("heading", { name: "Wykresy", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Zakres wykresu")).toBeVisible();
  await expect(page.getByLabel("Liczba punktów")).toBeVisible();
});

test("wykresy kołowe: widok", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/chartsPie");

  await expect(
    page.getByRole("heading", { name: "Wykresy kołowe" }),
  ).toBeVisible();
  await expect(page.getByText("Struktura per portfel")).toBeVisible();
});
