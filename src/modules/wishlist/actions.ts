'use server'

import { prisma } from '@/shared/db'
import { logger } from '@/shared/logger'
import crypto from 'crypto'

function generateShortCode(): string {
  // Generate a clean, human-friendly 6-character alphanumeric code
  const chars = '23456789abcdefghjkmnpqrstuvwxyz'
  let code = ''
  const bytes = crypto.randomBytes(6)
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return code
}

export async function createShortWishlistAction(
  productIds: string[]
): Promise<{ success: boolean; code?: string; error?: string }> {
  if (!productIds || productIds.length === 0) {
    return { success: false, error: 'Lista vazia' }
  }

  const idsString = productIds.filter(Boolean).join(',')

  try {
    // Generate unique short code
    let code = generateShortCode()
    let attempts = 0
    while (attempts < 5) {
      const existing = await prisma.sharedWishlist.findUnique({
        where: { id: code }
      })
      if (!existing) break
      code = generateShortCode()
      attempts++
    }

    await prisma.sharedWishlist.create({
      data: {
        id: code,
        productIds: idsString
      }
    })

    return { success: true, code }
  } catch (err) {
    logger.warn('WishlistActions', 'Failed to create short wishlist', {
      reason: err instanceof Error ? err.message : String(err)
    })
    return { success: false, error: 'Falha ao gerar link encurtado' }
  }
}

export async function getSharedWishlistProductIds(
  code: string
): Promise<string[] | null> {
  try {
    const item = await prisma.sharedWishlist.findUnique({
      where: { id: code }
    })
    if (!item) return null
    return item.productIds.split(',').filter(Boolean)
  } catch (err) {
    logger.warn('WishlistActions', 'Failed to fetch short wishlist', {
      code,
      reason: err instanceof Error ? err.message : String(err)
    })
    return null
  }
}
