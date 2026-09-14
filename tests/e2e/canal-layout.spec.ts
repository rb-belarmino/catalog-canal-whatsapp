import { test, expect } from "@playwright/test";

test.describe("Canal Concept Layout & Flow E2E Tests", () => {
  test("displays Canal Concept branding, top announcement bar, and header", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify title
    await expect(page).toHaveTitle(/Canal Concept/i);

    // Verify Top Announcement Bar is visible with perks
    const announcementBar = page.getByRole("region", { name: /Avisos e promoções/i });
    await expect(announcementBar).toBeVisible();
    await expect(announcementBar).toContainText(/FRETE GRÁTIS|PIX|PARCELE/i);

    // Verify Canal Concept logo in header
    const logoLink = page.getByRole("link", { name: /Canal Concept - Página Inicial/i });
    await expect(logoLink).toBeVisible();
  });

  test("filters product list instantly using the search bar", async ({ page }) => {
    await page.goto("/");

    // Locate search bar
    const searchInput = page.getByPlaceholder("BUSCAR NO CATÁLOGO...").first();
    await expect(searchInput).toBeVisible();

    // Type a non-existent item to test empty search state
    await searchInput.fill("TermoInexistenteXYZ123");

    // Should display empty search state with button to restore
    await expect(page.getByText(/Nenhuma Peça Encontrada/i)).toBeVisible();
    const restoreBtn = page.getByRole("button", { name: /Ver Todas as Peças/i });
    await expect(restoreBtn).toBeVisible();

    // Restore all items
    await restoreBtn.click();
    await expect(page.getByText(/Nenhuma Peça Encontrada/i)).not.toBeVisible();
  });

  test("manages Sacola de Desejos and generates formatted WhatsApp link", async ({
    page,
  }) => {
    await page.goto("/");

    // Inject a sample item in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "catalog_wishlist_items",
        JSON.stringify([
          {
            id: "prod-canal-1",
            name: "Vestido Midi Linho Canal",
            priceInCents: 49900,
            imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
            addedAt: Date.now(),
          },
        ])
      );
    });

    await page.reload();

    // Open Sacola
    const openSacolaBtn = page.locator('button[aria-label*="sacola"]').first();
    await openSacolaBtn.click();

    // Verify item in drawer
    await expect(page.getByText("Vestido Midi Linho Canal")).toBeVisible();
    await expect(page.getByText(/R\$\s*499,00/).first()).toBeVisible();
    await expect(page.getByText(/ou até 10x de R\$\s*49,90/i)).toBeVisible();

    // Verify WhatsApp checkout button is present
    const checkoutBtn = page.getByRole("button", { name: /Finalizar no WhatsApp/i });
    await expect(checkoutBtn).toBeVisible();
  });
});
