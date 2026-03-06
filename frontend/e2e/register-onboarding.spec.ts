import { test, expect } from "@playwright/test";

test("rejestracja i onboarding prowadzą do dashboardu", async ({ page }) => {
  await page.goto("/register");

  await page.fill('input[aria-label="Imię"]', "Jan");
  await page.fill('input[aria-label="Nazwisko"]', "Kowalski");
  await page.fill('input[aria-label="Email"]', "jan@example.com");
  await page.fill('input[aria-label="Hasło"]', "Strongpass1!");
  await page.fill('input[aria-label="Potwierdź hasło"]', "Strongpass1!");
  await page.click('button[aria-label="Zarejestruj"]');

  await expect(page).toHaveURL(/\/onboarding$/);

  await page.fill('input[aria-label="Data urodzenia"]', "1990-01-01");
  await page.getByRole("radio", { name: /Zrównoważony/ }).click();
  await page
    .getByLabel(
      "Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje.",
    )
    .click();
  await page.getByRole("button", { name: "Zapisz onboarding" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
});

test("rejestracja: walidacja hasła i confirm", async ({ page }) => {
  await page.goto("/register");

  await page.fill('input[aria-label="Imię"]', "Jan");
  await page.fill('input[aria-label="Nazwisko"]', "Kowalski");
  await page.fill('input[aria-label="Email"]', "jan@example.com");
  await page.fill('input[aria-label="Hasło"]', "abcdefghi");
  await page.fill('input[aria-label="Potwierdź hasło"]', "abcd");
  await page.getByRole("button", { name: "Zarejestruj" }).click();

  await expect(
    page.getByText("Hasło musi zawierać co najmniej jedną cyfrę"),
  ).toBeVisible();
  await expect(page.getByText("Hasła muszą być takie same")).toBeVisible();
});

test("onboarding blokuje niepełnoletniego", async ({ page }) => {
  await page.goto("/register");

  await page.fill('input[aria-label="Imię"]', "Jan");
  await page.fill('input[aria-label="Nazwisko"]', "Kowalski");
  await page.fill('input[aria-label="Email"]', "jan@example.com");
  await page.fill('input[aria-label="Hasło"]', "Strongpass1!");
  await page.fill('input[aria-label="Potwierdź hasło"]', "Strongpass1!");
  await page.getByRole("button", { name: "Zarejestruj" }).click();

  await expect(page).toHaveURL(/\/onboarding$/);

  await page.fill('input[aria-label="Data urodzenia"]', "2010-01-01");
  await page.getByRole("radio", { name: /Ostrożny/ }).click();
  await page
    .getByLabel(
      "Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje.",
    )
    .click();
  await page.getByRole("button", { name: "Zapisz onboarding" }).click();

  await expect(page.getByText("Musisz mieć ukończone 18 lat")).toBeVisible();
});
