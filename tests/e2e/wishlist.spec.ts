import { test, expect } from "@playwright/test";

test.describe("User Story 3: Wishlist Flow", () => {
  test("wishlist starts empty and opens drawer", async ({ page }) => {
    await page.goto("/");
    await page.click('button[aria-label="Abrir Lista de Desejos"]');

    await expect(page.getByText(/Sua lista está vazia/i)).toBeVisible();
    await expect(page.getByText(/Total Estimado/i)).toBeVisible();
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
    await page.click('button[aria-label="Abrir Lista de Desejos"]');

    // Should display the item and calculated total
    await expect(page.getByText("Vestido Teste Midi")).toBeVisible();
    await expect(page.getByText("R$ 150,00")).toBeVisible();

    // Remove item
    await page.click('button[aria-label*="Remover Vestido Teste Midi"]');
    await expect(page.getByText(/Sua lista está vazia/i)).toBeVisible();
  });
});
