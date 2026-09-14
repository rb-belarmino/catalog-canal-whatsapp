import { test, expect } from '@playwright/test'

test.describe('User Story 3: Wishlist Flow', () => {
  test('wishlist starts empty and opens drawer', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-testid="wishlist-trigger"]').click()

    await expect(
      page.getByText(/Sua Lista de Desejos está Vazia/i)
    ).toBeVisible()
  })

  test('persists wishlist in localStorage', async ({ page }) => {
    await page.goto('/')

    // Set sample wishlist in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        'catalog_wishlist_items',
        JSON.stringify([
          {
            id: 'test-prod-1',
            name: 'Vestido Teste Midi',
            priceInCents: 15000,
            imageUrl:
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
            addedAt: Date.now()
          }
        ])
      )
    })

    await page.reload()
    await page.locator('[data-testid="wishlist-trigger"]').click()

    // Should display the item and calculated total
    await expect(page.getByText('Vestido Teste Midi')).toBeVisible()
    await expect(page.getByText(/R\$\s*150,00/).first()).toBeVisible()

    // Remove item
    await page.click('button[aria-label*="Remover Vestido Teste Midi"]')
    await expect(
      page.getByText(/Sua Lista de Desejos está Vazia/i)
    ).toBeVisible()
  })

  test('allows adding and removing item directly from product card', async ({
    page
  }) => {
    await page.goto('/')

    // Check if there is any product card
    const firstAddButton = page
      .locator('button:has-text("Adicionar aos Desejos")')
      .first()
    const hasProducts = await firstAddButton.isVisible().catch(() => false)

    if (hasProducts) {
      await firstAddButton.click()

      // The button should transition to added state
      const addedButton = page
        .locator('button:has-text("Na Lista de Desejos")')
        .first()
      await expect(addedButton).toBeVisible()

      // Wishlist floating button badge should show 1
      const floatingBtn = page.locator(
        '[data-testid="floating-wishlist-button"]'
      )
      await expect(floatingBtn).toBeVisible()

      // Click again to remove directly from card
      await addedButton.click()

      // Button should revert back to "Adicionar aos Desejos"
      await expect(firstAddButton).toBeVisible()
    }
  })

  test('renders shared wishlist page /lista with selected items', async ({
    page
  }) => {
    // Inject item into localStorage
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem(
        'catalog_wishlist_items',
        JSON.stringify([
          {
            id: 'test-prod-lista',
            name: 'Camisa Seda Canal',
            priceInCents: 29900,
            imageUrl:
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
            addedAt: Date.now()
          }
        ])
      )
    })

    await page.goto('/lista')
    await expect(
      page.getByRole('heading', { name: /Lista de Desejos/i })
    ).toBeVisible()
    await expect(page.getByText('Camisa Seda Canal')).toBeVisible()
    await expect(page.getByText(/R\$\s*299,00/).first()).toBeVisible()
    await expect(page.getByText(/1 peça selecionada/i)).toBeVisible()
  })
})
