/**
 * Contract: WhatsApp Message Payload and Formatter
 * Defines the structure of the message generated when a customer checks out their Wishlist.
 */

export interface WishlistProductPayload {
  name: string;
  priceInCents: number;
  quantity: number;
}

export interface WhatsAppOrderRequest {
  whatsappNumber: string; // E.164 without '+' or digits with country code: e.g. "5511999999999"
  storeName: string;      // "Canal Concept"
  items: WishlistProductPayload[];
  totalInCents: number;
}

export interface WhatsAppOrderResponse {
  rawMessage: string;
  whatsappUrl: string; // e.g. "https://wa.me/5511999999999?text=..."
}

/**
 * Expected message format:
 *
 * Olá! Gostei dessas peças da *Canal Concept*:
 *
 * - 1x Vestido Midi Linho (R$ 499,00)
 * - 1x Blazer Alfaiataria (R$ 699,00)
 *
 * *Total Estimado: R$ 1.198,00*
 *
 * Gostaria de verificar os tamanhos disponíveis e finalizar o pedido!
 */
