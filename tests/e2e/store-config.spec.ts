import { test, expect } from "@playwright/test";

test.describe("User Story 5: Store WhatsApp Number Configuration", () => {
  test("updates store name and phone number in admin settings", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[type="password"]', "admin123_dev_password");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin$/);

    // Fill store settings
    const storeNameInput = page.locator('input[placeholder*="Canal"]');
    await storeNameInput.fill("Canal Concept Campinas");

    const phoneInput = page.locator('input[placeholder*="5511999998888"]');
    await phoneInput.fill("5511999997777");

    await page.click('button:has-text("Salvar Configurações")');
    await expect(page.getByText(/Configurações salvas com sucesso/i)).toBeVisible();

    // Verify change reflected in public catalog
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Canal Concept/i })).toBeVisible();
  });
});
