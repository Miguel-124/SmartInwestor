import { test, expect } from "@playwright/test";
import { setAuthToken } from "./helpers/auth";

test("analiza: podstawowe sekcje", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/analysis");

  await expect(page.getByText("Analiza portfela")).toBeVisible();
  await expect(page.getByText("Rekomendacje")).toBeVisible();
  await expect(page.getByText("Ekspozycja portfela")).toBeVisible();
  await expect(page.getByText("Symulacje stress test")).toBeVisible();
});
