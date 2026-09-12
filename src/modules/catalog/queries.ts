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
  dbError?: boolean;
}

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
 * Fetches store display configuration
 */
export async function getShopConfig(): Promise<PublicShopConfig> {
  try {
    const config = await prisma.shopConfig.findUnique({
      where: { id: "default" },
    });
    return {
      storeName: config?.storeName || "Catálogo de Roupas",
      whatsappNumber: config?.whatsappNumber || "",
      dbError: false,
    };
  } catch (err) {
    logger.warn("CatalogQueries", "Database not accessible, using default store configuration", {
      reason: err instanceof Error ? err.message : String(err),
    });
    return {
      storeName: "Catálogo de Roupas",
      whatsappNumber: "",
      dbError: true,
    };
  }
}
