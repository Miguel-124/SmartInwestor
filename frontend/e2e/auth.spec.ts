import { test, expect } from "@playwright/test";

test("logowanie przekierowuje na dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[aria-label="Email"]', "jan@example.com");
  await page.fill('input[aria-label="Hasło"]', "strong-password-1!");
  await page.click('button[aria-label="Zaloguj"]');

  await expect(page).toHaveURL(/\/dashboard$/);
});

test("walidacja logowania pokazuje błędy", async ({ page }) => {
  await page.goto("/login");
  await page.locator('form button[aria-label="Zaloguj"]').click();

  await expect(page.getByText("Email jest wymagany")).toBeVisible();
  await expect(page.getByText("Hasło jest wymagane")).toBeVisible();
});
