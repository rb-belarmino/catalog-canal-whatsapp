import { formatCurrencyBRL } from '@/shared/utils'
import type { WishlistItem } from './context'

export interface BuildWhatsAppMessageOptions {
  items: WishlistItem[]
  totalInCents?: number
  whatsappNumber: string
  storeName?: string
  shareUrl?: string
  origin?: string
}

export function formatWhatsAppMessage({
  items,
  shareUrl
}: {
  items: WishlistItem[]
  totalInCents?: number
  storeName?: string
  shareUrl?: string
}): string {
  const greeting = 'Olá, Jéssica! Separei essas peças da minha lista de desejos da *Canal*:'

  if (shareUrl) {
    return `${greeting}\n\n${shareUrl}`
  }

  // Fallback if no shareUrl is provided
  return [
    greeting,
    '',
    ...items.map(item => `• *${item.name}* - ${formatCurrencyBRL(item.priceInCents)}`)
  ].join('\n')
}

export function buildWhatsAppUrl(
  options: BuildWhatsAppMessageOptions
): string | null {
  const cleanNumber = options.whatsappNumber.replace(/\D/g, '')
  if (!cleanNumber) return null

  let shareUrl = options.shareUrl
  if (!shareUrl) {
    const origin =
      options.origin ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    if (origin && options.items.length > 0) {
      const ids = options.items.map(i => i.id).filter(Boolean).join(',')
      shareUrl = `${origin}/lista?ids=${ids}`
    }
  }

  const message = formatWhatsAppMessage({
    ...options,
    shareUrl
  })
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

export function dispatchToWhatsApp(url: string): void {
  if (typeof window === 'undefined') return
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (isMobile) {
    window.location.href = url
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
