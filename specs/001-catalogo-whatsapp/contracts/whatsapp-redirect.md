# Contract: WhatsApp Redirection & Message Formatter

**Module**: `src/modules/wishlist/whatsapp.ts`  
**Purpose**: Build pre-formatted, polite Portuguese WhatsApp order messages and generate direct open links for mobile and desktop.

---

## 1. URL Scheme Specification

```typescript
function buildWhatsAppUrl(params: {
  whatsappNumber: string;
  items: Array<{ name: string; priceInCents: number; imageUrl: string }>;
  totalInCents: number;
  storeName?: string;
  isMobile?: boolean;
}): string
```

### Destination Number
- `whatsappNumber`: Must contain only digits, e.g., `5511999999999`.
- If `whatsappNumber` is empty, the function returns an empty string or throws `MissingWhatsAppNumberError`.

### Base URL
- Universal link: `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formattedText)}`

---

## 2. Message Format Layout

The text output follows the user specification and clarifications (Session 2026-09-12):

```text
Olá! Vi o catálogo e montei minha lista de desejos:

• {Product Name 1} - R$ {Price 1}
  Foto: {Image URL 1}

• {Product Name 2} - R$ {Price 2}
  Foto: {Image URL 2}

*Total: R$ {Total Price}*

Gostaria de confirmar a disponibilidade dessas peças!
```

### Example Rendered Message
```text
Olá! Vi o catálogo e montei minha lista de desejos:

• Vestido Floral Midi - R$ 189,90
  Foto: https://utfs.io/f/sample-vestido.jpg

• Blusa de Linho Bege - R$ 120,00
  Foto: https://utfs.io/f/sample-blusa.jpg

*Total: R$ 309,90*

Gostaria de confirmar a disponibilidade dessas peças!
```

---

## 3. Platform Detection & Redirection Rules

- **Mobile (iOS / Android)**:
  - Triggered via direct navigation: `window.location.href = waUrl;`.
  - Opens native WhatsApp client directly.
- **Desktop**:
  - Opens in a new tab: `window.open(waUrl, '_blank', 'noopener,noreferrer');`.
- **Safety / Truncation Guard**:
  - Maximum safe URL query length: 2,000 characters.
  - If length exceeds 1,900 chars, items are truncated to the first N items with a footer line: `\n(... e mais X itens)` followed by the intact `*Total: R$ YYY*`.
