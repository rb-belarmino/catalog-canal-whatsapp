import { test, expect } from "@playwright/test";

test.describe("User Story 2: Public Catalog Browsing", () => {
  test("loads public catalog without authentication", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Catálogo de Roupas/i);

    // Verify header exists
    await expect(page.locator("header")).toBeVisible();
  });

  test("is usable in 375px mobile viewport without horizontal overflow (iPhone SE)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Verify page width does not cause horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("displays friendly empty state or product grid", async ({ page }) => {
    await page.goto("/");

    // Either the empty state message or product grid must be present
    const emptyNotice = page.getByText(/Nosso catálogo está sendo preparado/i);
    const productGrid = page.locator('[data-testid="product-grid"]');

    const hasEmptyNotice = await emptyNotice.isVisible().catch(() => false);
    const hasGrid = await productGrid.isVisible().catch(() => false);

    expect(hasEmptyNotice || hasGrid).toBeTruthy();
  });
});
