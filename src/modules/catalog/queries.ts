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
  "FRETE GRÁTIS ACIMA DE R$ 599,00 | PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX";

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
