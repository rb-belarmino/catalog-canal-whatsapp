import { prisma } from '@/shared/db'
import { logger } from '@/shared/logger'

export interface CatalogPiece {
  id: string
  name: string
  priceInCents: number
  formattedPrice?: string
  colors?: string[]
  composition?: string
  details?: string[]
}

export interface CatalogProduct {
  id: string
  name: string
  priceInCents: number
  imageUrl: string
  pieces?: CatalogPiece[]
}

export interface PublicShopConfig {
  storeName: string
  whatsappNumber: string
  topAnnouncement: string
  dbError?: boolean
}

const DEFAULT_ANNOUNCEMENT = 'PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX'

/**
 * Fetches all active products ordered manually by the shopkeeper (sortOrder ASC)
 */
export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        priceInCents: true,
        imageUrl: true,
        pieces: true
      }
    })
    return products as unknown as CatalogProduct[]
  } catch (err) {
    logger.warn(
      'CatalogQueries',
      'Database not accessible, returning empty products list',
      {
        reason: err instanceof Error ? err.message : String(err)
      }
    )
    return []
  }
}

/**
 * Fetches specific products or individual pieces by their IDs
 */
export async function getProductsByIds(
  ids: string[]
): Promise<CatalogProduct[]> {
  if (!ids || ids.length === 0) return []
  try {
    // Extract base look IDs if IDs refer to pieces like 'look-01-p2'
    const parentIds = ids.map(id => id.replace(/-p\d+$/, ''))
    const uniqueLookupIds = Array.from(new Set([...ids, ...parentIds]))

    const products = await prisma.product.findMany({
      where: {
        id: { in: uniqueLookupIds },
        active: true
      },
      select: {
        id: true,
        name: true,
        priceInCents: true,
        imageUrl: true,
        pieces: true
      }
    })

    // Maintain a map of both the Look itself and each of its constituent pieces
    const itemMap = new Map<string, CatalogProduct>()
    for (const p of products) {
      const piecesList = (p.pieces as unknown as CatalogPiece[]) || []
      itemMap.set(p.id, {
        id: p.id,
        name: p.name,
        priceInCents: p.priceInCents,
        imageUrl: p.imageUrl,
        pieces: piecesList
      })

      for (const piece of piecesList) {
        if (piece && piece.id) {
          const colorsStr =
            piece.colors && piece.colors.length > 0
              ? ` (${piece.colors.join(', ')})`
              : ''
          itemMap.set(piece.id, {
            id: piece.id,
            name: `${piece.name}${colorsStr} - ${p.name}`,
            priceInCents: piece.priceInCents,
            imageUrl: p.imageUrl
          })
        }
      }
    }

    // Maintain the order in which the IDs were requested
    return ids
      .map(id => itemMap.get(id))
      .filter((p): p is CatalogProduct => Boolean(p))
  } catch (err) {
    logger.warn(
      'CatalogQueries',
      'Database not accessible in getProductsByIds',
      {
        reason: err instanceof Error ? err.message : String(err)
      }
    )
    return []
  }
}

/**
 * Fetches store display configuration
 */
export async function getShopConfig(): Promise<PublicShopConfig> {
  try {
    const config = await prisma.shopConfig.findUnique({
      where: { id: 'default' }
    })
    return {
      storeName: config?.storeName || 'Canal Concept',
      whatsappNumber: config?.whatsappNumber || '',
      topAnnouncement: config?.topAnnouncement || DEFAULT_ANNOUNCEMENT,
      dbError: false
    }
  } catch (err) {
    logger.warn(
      'CatalogQueries',
      'Database not accessible, using default store configuration',
      {
        reason: err instanceof Error ? err.message : String(err)
      }
    )
    return {
      storeName: 'Canal Concept',
      whatsappNumber: '',
      topAnnouncement: DEFAULT_ANNOUNCEMENT,
      dbError: true
    }
  }
}
