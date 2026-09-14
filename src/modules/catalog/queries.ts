import { prisma } from "@/shared/db";
import { logger } from "@/shared/logger";

export interface CatalogProduct {
  id: string;
  name: string;
  priceInCents: number;
  imageUrl: string;
}

export interface PublicShopConfig {
  storeName: string;
  whatsappNumber: string;
  topAnnouncement: string;
  dbError?: boolean;
}

const DEFAULT_ANNOUNCEMENT =
  "PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX";

/**
 * Fetches all active products ordered manually by the shopkeeper (sortOrder ASC)
 */
export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        priceInCents: true,
        imageUrl: true,
      },
    });
    return products;
  } catch (err) {
    logger.warn("CatalogQueries", "Database not accessible, returning empty products list", {
      reason: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Fetches specific products by their IDs
 */
export async function getProductsByIds(ids: string[]): Promise<CatalogProduct[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        active: true,
      },
      select: {
        id: true,
        name: true,
        priceInCents: true,
        imageUrl: true,
      },
    });

    // Maintain the order in which the IDs were provided
    const productMap = new Map(products.map((p) => [p.id, p]));
    return ids
      .map((id) => productMap.get(id))
      .filter((p): p is CatalogProduct => Boolean(p));
  } catch (err) {
    logger.warn("CatalogQueries", "Database not accessible in getProductsByIds", {
      reason: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Fetches store display configuration
 */
export async function getShopConfig(): Promise<PublicShopConfig> {
  try {
    const config = await prisma.shopConfig.findUnique({
      where: { id: "default" },
    });
    return {
      storeName: config?.storeName || "Canal Concept",
      whatsappNumber: config?.whatsappNumber || "",
      topAnnouncement: config?.topAnnouncement || DEFAULT_ANNOUNCEMENT,
      dbError: false,
    };
  } catch (err) {
    logger.warn("CatalogQueries", "Database not accessible, using default store configuration", {
      reason: err instanceof Error ? err.message : String(err),
    });
    return {
      storeName: "Canal Concept",
      whatsappNumber: "",
      topAnnouncement: DEFAULT_ANNOUNCEMENT,
      dbError: true,
    };
  }
}
