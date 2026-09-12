import { formatCurrencyBRL } from "@/shared/utils";
import type { WishlistItem } from "./context";

export interface BuildWhatsAppMessageOptions {
  items: WishlistItem[];
  totalInCents: number;
  whatsappNumber: string;
  storeName?: string;
}

function formatItemLine(item: WishlistItem): string[] {
  return [
    `• *${item.name}* - ${formatCurrencyBRL(item.priceInCents)}`,
    `  Foto: ${item.imageUrl}`,
    "",
  ];
}

function truncateIfLong(
  lines: string[],
  items: WishlistItem[],
  greeting: string,
  totalFormatted: string
): string {
  const full = lines.join("\n");
  if (full.length <= 1900 || items.length <= 3) return full;

  const remainder = items.length - 3;
  const countLabel = remainder === 1 ? "peça selecionada" : "peças selecionadas";

  const truncated: string[] = [
    greeting,
    "",
    ...items.slice(0, 3).flatMap(formatItemLine),
    `_(... e mais ${remainder} ${countLabel})_`,
    "",
    `*Total: ${totalFormatted}*`,
    "",
    "Gostaria de confirmar a disponibilidade dessas peças!",
  ];

  return truncated.join("\n");
}

export function formatWhatsAppMessage({
  items,
  totalInCents,
  storeName,
}: {
  items: WishlistItem[];
  totalInCents: number;
  storeName?: string;
}): string {
  const greeting = storeName
    ? `Olá, equipe da *${storeName}*! Vi o catálogo e montei minha lista de desejos:`
    : `Olá! Vi o catálogo e montei minha lista de desejos:`;

  const totalFormatted = formatCurrencyBRL(totalInCents);

  const lines: string[] = [
    greeting,
    "",
    ...items.flatMap(formatItemLine),
    `*Total: ${totalFormatted}*`,
    "",
    "Gostaria de confirmar a disponibilidade dessas peças!",
  ];

  return truncateIfLong(lines, items, greeting, totalFormatted);
}

export function buildWhatsAppUrl(options: BuildWhatsAppMessageOptions): string | null {
  const cleanNumber = options.whatsappNumber.replace(/\D/g, "");
  if (!cleanNumber) return null;

  const message = formatWhatsAppMessage(options);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function dispatchToWhatsApp(url: string): void {
  if (typeof window === "undefined") return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
