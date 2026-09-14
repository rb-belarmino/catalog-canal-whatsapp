"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/db";
import { logger } from "@/shared/logger";
import {
  verifyAdminPassword,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  isAuthenticatedAdmin,
} from "./auth";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Admin Login Action
 */
export async function loginAdminAction(formData: FormData): Promise<ActionResult> {
  const password = formData.get("password") as string;
  if (!password) {
    return { success: false, error: "Por favor, digite sua senha de acesso." };
  }

  const isValid = verifyAdminPassword(password);
  if (!isValid) {
    logger.warn("AdminActions", "Failed admin login attempt");
    return { success: false, error: "Senha incorreta. Tente novamente." };
  }

  await setAdminSessionCookie();
  logger.info("AdminActions", "Admin login successful");
  return { success: true };
}

/**
 * Admin Logout Action
 */
export async function logoutAdminAction(): Promise<void> {
  await clearAdminSessionCookie();
  logger.info("AdminActions", "Admin logged out");
  redirect("/admin/login");
}

/**
 * Helper to ensure caller is authenticated
 */
async function requireAuth(): Promise<void> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Não autorizado. Faça login novamente.");
  }
}

/**
 * Create a new Product
 */
export async function createProductAction(input: {
  name: string;
  priceInCents: number;
  imageUrl: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();

    const name = input.name?.trim();
    if (!name || name.length < 2 || name.length > 120) {
      return { success: false, error: "O nome da peça deve ter entre 2 e 120 caracteres." };
    }

    if (!input.priceInCents || input.priceInCents <= 0 || input.priceInCents > 100000000) {
      return { success: false, error: "O preço informado é inválido." };
    }

    if (!input.imageUrl || !input.imageUrl.startsWith("http")) {
      return { success: false, error: "Por favor, envie uma foto válida para o produto." };
    }

    // Determine next sortOrder (at the end)
    const maxOrder = await prisma.product.aggregate({
      _max: { sortOrder: true },
    });
    const nextSortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const product = await prisma.product.create({
      data: {
        name,
        priceInCents: input.priceInCents,
        imageUrl: input.imageUrl,
        active: true,
        sortOrder: nextSortOrder,
      },
      select: { id: true },
    });

    logger.info("AdminActions", "Product created", { productId: product.id });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, data: { id: product.id } };
  } catch (err) {
    logger.error("AdminActions", "Error creating product", { error: String(err) });
    return { success: false, error: "Ocorreu um erro ao salvar o produto." };
  }
}

/**
 * Update an existing Product
 */
export async function updateProductAction(input: {
  id: string;
  name?: string;
  priceInCents?: number;
  imageUrl?: string;
  active?: boolean;
}): Promise<ActionResult> {
  try {
    await requireAuth();

    const data: Record<string, unknown> = {};

    if (input.name !== undefined) {
      const trimmed = input.name.trim();
      if (trimmed.length < 2 || trimmed.length > 120) {
        return { success: false, error: "O nome da peça deve ter entre 2 e 120 caracteres." };
      }
      data.name = trimmed;
    }

    if (input.priceInCents !== undefined) {
      if (input.priceInCents <= 0 || input.priceInCents > 100000000) {
        return { success: false, error: "O preço informado é inválido." };
      }
      data.priceInCents = input.priceInCents;
    }

    if (input.imageUrl !== undefined) {
      data.imageUrl = input.imageUrl;
    }

    if (input.active !== undefined) {
      data.active = input.active;
    }

    await prisma.product.update({
      where: { id: input.id },
      data,
    });

    logger.info("AdminActions", "Product updated", { productId: input.id });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    logger.error("AdminActions", "Error updating product", { error: String(err) });
    return { success: false, error: "Ocorreu um erro ao atualizar o produto." };
  }
}

/**
 * Delete a Product
 */
export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    await prisma.product.delete({
      where: { id },
    });

    logger.info("AdminActions", "Product deleted", { productId: id });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    logger.error("AdminActions", "Error deleting product", { error: String(err) });
    return { success: false, error: "Ocorreu um erro ao excluir o produto." };
  }
}

/**
 * Reorder Products in batch
 */
export async function reorderProductsAction(orderedIds: string[]): Promise<ActionResult> {
  try {
    await requireAuth();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    logger.info("AdminActions", "Products reordered", { count: orderedIds.length });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    logger.error("AdminActions", "Error reordering products", { error: String(err) });
    return { success: false, error: "Ocorreu um erro ao salvar a nova ordem." };
  }
}

/**
 * Update Shop Configuration
 */
export async function updateShopConfigAction(input: {
  storeName?: string;
  whatsappNumber?: string;
  topAnnouncement?: string;
}): Promise<ActionResult> {
  try {
    await requireAuth();

    const data: Record<string, string> = {};

    if (input.storeName !== undefined) {
      const trimmed = input.storeName.trim();
      if (trimmed.length < 2 || trimmed.length > 80) {
        return { success: false, error: "O nome da loja deve ter entre 2 e 80 caracteres." };
      }
      data.storeName = trimmed;
    }

    if (input.whatsappNumber !== undefined) {
      const cleanPhone = input.whatsappNumber.replace(/\D/g, "");
      if (cleanPhone && !/^[1-9][0-9]{9,14}$/.test(cleanPhone)) {
        return {
          success: false,
          error: "Número de WhatsApp inválido. Digite o código do país + DDD + número (ex: 5511999998888).",
        };
      }
      data.whatsappNumber = cleanPhone;
    }

    if (input.topAnnouncement !== undefined) {
      const trimmed = input.topAnnouncement.trim();
      if (trimmed.length > 255) {
        return { success: false, error: "O comunicado da barra de topo deve ter no máximo 255 caracteres." };
      }
      data.topAnnouncement = trimmed;
    }

    await prisma.shopConfig.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        storeName: data.storeName ?? "Canal Concept",
        whatsappNumber: data.whatsappNumber ?? "",
        topAnnouncement: data.topAnnouncement ?? "FRETE GRÁTIS ACIMA DE R$ 599,00 | PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX",
      },
      update: data,
    });

    logger.info("AdminActions", "Shop configuration updated");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    logger.error("AdminActions", "Error updating shop config", { error: String(err) });
    return { success: false, error: "Ocorreu um erro ao atualizar as configurações." };
  }
}
