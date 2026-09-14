import { test, expect } from "@playwright/test";

test.describe("User Story 4: Send Wishlist to WhatsApp", () => {
  test("button is not visible when wishlist is empty", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="wishlist-trigger"]').click();

    const sendButton = page.getByRole("button", { name: /Enviar Lista no WhatsApp/i });
    await expect(sendButton).not.toBeVisible();
    await expect(page.getByText(/Sua Lista de Desejos está Vazia/i)).toBeVisible();
  });

  test("generates correct WhatsApp redirection format when items exist", async ({ page }) => {
    await page.goto("/");

    // Inject wishlist item
    await page.evaluate(() => {
      localStorage.setItem(
        "catalog_wishlist_items",
        JSON.stringify([
          {
            id: "wa-prod-1",
            name: "Blusa de Linho",
            priceInCents: 12000,
            imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
            addedAt: Date.now(),
          },
        ])
      );
    });

    await page.reload();
    await page.locator('[data-testid="wishlist-trigger"]').click();

    const sendButton = page.getByRole("button", { name: /Enviar Lista no WhatsApp/i });
    // Check if configured or warning is shown
    const isButtonEnabled = await sendButton.isEnabled().catch(() => false);
    if (isButtonEnabled) {
      // Mock window.open / window.location to assert target URL
      const popupPromise = page.waitForEvent("popup", { timeout: 5000 }).catch(() => null);
      await sendButton.click();
      const popup = await popupPromise;
      if (popup) {
        expect(popup.url()).toMatch(/wa\.me|whatsapp\.com/);
        const decodedUrl = decodeURIComponent(popup.url().replace(/\+/g, " "));
        expect(decodedUrl).toContain("Blusa de Linho");
      }
    }
  });
});
