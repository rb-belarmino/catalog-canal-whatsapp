import { test, expect } from '@playwright/test'

test.describe('User Story 1: Admin Management Flow', () => {
  test('unauthenticated access redirects to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/.*\/admin\/login/)
    await expect(
      page.getByRole('heading', { name: /Acesso Administrativo/i })
    ).toBeVisible()
  })

  test('invalid password displays error message', async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('input[type="password"]', 'wrong_password_test')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/Senha incorreta/i)).toBeVisible()
    await expect(page).toHaveURL(/.*\/admin\/login/)
  })

  test('valid password logs in and maintains session', async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('input[type="password"]', 'admin123_dev_password')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByText(/Painel de Produtos/i)).toBeVisible()

    // Reload page to verify session persistence
    await page.reload()
    await expect(page).toHaveURL(/\/admin$/)
  })
})
