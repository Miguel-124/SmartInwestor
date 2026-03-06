import { test, expect } from "@playwright/test";
import { setAuthToken } from "./helpers/auth";

test("profil: ustawienia profilu są widoczne", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/profile/settings");

  await expect(
    page.getByRole("heading", { name: "Ustawienia profilu" }),
  ).toBeVisible();
  await expect(page.getByLabel("Imię")).toBeVisible();
  await expect(page.getByLabel("Nazwisko")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("profil: zapis zmian profilu", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/profile/settings");

  await page.getByLabel("Imię").fill("Jan");
  await page.getByLabel("Data urodzenia").fill("1990-01-01");
  await page.getByRole("radio", { name: /Agresywny/ }).click();
  await page
    .getByLabel(
      "Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje.",
    )
    .click();
  await page.getByRole("button", { name: "Zapisz zmiany" }).click();

  await expect(page.getByText("Zapisano zmiany profilu.")).toBeVisible();
});

test("profil: przejście do sekcji Pomoc", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/profile/settings");

  await page.getByRole("link", { name: "Pomoc" }).click();
  await expect(page).toHaveURL(/\/profile\/help$/);
});
