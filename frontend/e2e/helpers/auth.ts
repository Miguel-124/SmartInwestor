import type { Page } from "@playwright/test";

export async function setAuthToken(page: Page, token = "mock-token-123") {
  await page.addInitScript((value) => {
    localStorage.setItem("smartinwestor_token", value);
  }, token);
}
