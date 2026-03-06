import { test, expect } from "@playwright/test";
import { setAuthToken } from "./helpers/auth";

test("portfele: dodanie nowego portfela", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/portfolios");

  await page.getByRole("button", { name: "Dodaj portfel" }).click();
  await page.getByLabel("Nazwa portfela").fill("Nowy portfel");
  await page.getByLabel("portfolio-submit").click();

  await expect(page.getByText("Nowy portfel")).toBeVisible();
});

test("portfele: edycja nazwy istniejącego portfela", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/portfolios");

  await page.getByLabel("portfolio-p1").click();
  await page.getByLabel("Edytuj portfel").first().click();
  await page.getByLabel("Nazwa portfela").fill("Długoterminowy X");
  await page.getByLabel("portfolio-submit").click();

  await expect(page.getByText("Długoterminowy X")).toBeVisible();
});

test("portfele: usunięcie portfela", async ({ page }) => {
  await setAuthToken(page);
  await page.goto("/portfolios");

  await expect(page.getByText("Spekulacyjny")).toBeVisible();
  await page.getByLabel("portfolio-p2").click();
  await page.getByLabel("Usuń portfel").first().click();
  await page.getByLabel("confirm-dialog").isVisible();
  await page.getByLabel("confirm-delete").click();

  await expect(page.getByLabel("confirm-dialog")).toHaveCount(0);
  await page.reload();
  await expect(page.getByLabel("portfolio-p2")).toHaveCount(0);
});
