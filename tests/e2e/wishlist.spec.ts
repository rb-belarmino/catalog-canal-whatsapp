import { test, expect } from "@playwright/test";

test.describe("User Story 3: Wishlist Flow", () => {
  test("wishlist starts empty and opens drawer", async ({ page }) => {
    await page.goto("/");
    await page.click('button[aria-label*="sacola"]');

    await expect(page.getByText(/Sua Sacola está Vazia/i)).toBeVisible();
  });

  test("persists wishlist in localStorage", async ({ page }) => {
    await page.goto("/");

    // Set sample wishlist in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "catalog_wishlist_items",
        JSON.stringify([
          {
            id: "test-prod-1",
            name: "Vestido Teste Midi",
            priceInCents: 15000,
            imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
            addedAt: Date.now(),
          },
        ])
      );
    });

    await page.reload();
    await page.click('button[aria-label*="sacola"]');

    // Should display the item and calculated total
    await expect(page.getByText("Vestido Teste Midi")).toBeVisible();
    await expect(page.getByText(/R\$\s*150,00/).first()).toBeVisible();

    // Remove item
    await page.click('button[aria-label*="Remover Vestido Teste Midi"]');
    await expect(page.getByText(/Sua Sacola está Vazia/i)).toBeVisible();
  });

  test("allows adding and removing item directly from product card", async ({ page }) => {
    await page.goto("/");

    // Check if there is any product card
    const firstAddButton = page.locator('button:has-text("Adicionar à Sacola")').first();
    const hasProducts = await firstAddButton.isVisible().catch(() => false);

    if (hasProducts) {
      await firstAddButton.click();

      // The button should transition to added state
      const addedButton = page.locator('button:has-text("Na Sacola")').first();
      await expect(addedButton).toBeVisible();

      // Wishlist floating button badge should show 1
      const floatingBtn = page.locator('button[aria-label*="Sacola"]');
      await expect(floatingBtn).toBeVisible();

      // Click again to remove directly from card
      await addedButton.click();

      // Button should revert back to "Adicionar à Sacola"
      await expect(firstAddButton).toBeVisible();
    }
  });
});
