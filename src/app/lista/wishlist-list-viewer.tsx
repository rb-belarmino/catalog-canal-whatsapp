'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, ArrowLeft, ImageOff } from 'lucide-react'
import { formatCurrencyBRL } from '@/shared/utils'
import { useWishlist } from '@/modules/wishlist/context'
import { buildWhatsAppUrl, dispatchToWhatsApp } from '@/modules/wishlist/whatsapp'
import { createShortWishlistAction } from '@/modules/wishlist/actions'
import type { CatalogProduct } from '@/modules/catalog/queries'

interface WishlistListViewerProps {
  initialProducts: CatalogProduct[]
  whatsappNumber: string
  storeName?: string
}

export function WishlistListViewer({
  initialProducts,
  whatsappNumber,
  storeName = 'Canal Concept'
}: WishlistListViewerProps) {
  const { items: localItems } = useWishlist()
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // If initialProducts from server is provided (via ?ids=), use it.
  // Otherwise, fallback to the local wishlist if loaded on client.
  const displayItems: Array<{
    id: string
    name: string
    priceInCents: number
    imageUrl: string
  }> = React.useMemo(() => {
    if (initialProducts.length > 0) {
      return initialProducts
    }
    if (isClient && localItems.length > 0) {
      return localItems
    }
    return []
  }, [initialProducts, isClient, localItems])

  const totalInCents = React.useMemo(() => {
    return displayItems.reduce((acc, item) => acc + item.priceInCents, 0)
  }, [displayItems])

  const isEmpty = isClient && displayItems.length === 0

  async function handleSendToWhatsApp() {
    if (displayItems.length === 0) return

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const ids = displayItems.map(i => i.id).filter(Boolean)
    let shareUrl: string | undefined = undefined

    if (origin && ids.length > 0) {
      try {
        const res = await createShortWishlistAction(ids)
        if (res.success && res.code) {
          shareUrl = `${origin}/l/${res.code}`
        } else {
          shareUrl = `${origin}/lista?ids=${encodeURIComponent(ids.join(','))}`
        }
      } catch {
        shareUrl = `${origin}/lista?ids=${encodeURIComponent(ids.join(','))}`
      }
    }

    const url = buildWhatsAppUrl({
      items: displayItems.map(i => ({ ...i, addedAt: Date.now() })),
      totalInCents,
      whatsappNumber,
      storeName,
      shareUrl
    })

    if (url) {
      dispatchToWhatsApp(url)
    }
  }

  if (isEmpty) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <Heart className="w-7 h-7 text-neutral-400" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-[3px] text-black">
          Nenhuma Peça Selecionada
        </h2>
        <p className="text-xs text-neutral-500 mt-2 max-w-sm leading-relaxed">
          Navegue pelas peças da Canal Concept e selecione seus itens favoritos para criar sua lista de desejos.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[2px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explorar Catálogo</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top action / Counter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2E2] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-[2px] text-neutral-500 font-medium">
            {displayItems.length} {displayItems.length === 1 ? 'peça selecionada' : 'peças selecionadas'}
          </span>
          <p className="text-lg font-bold tracking-tight text-black mt-0.5">
            Subtotal: {formatCurrencyBRL(totalInCents)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#E2E2E2] hover:border-black text-black text-xs uppercase tracking-[1.5px] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catálogo Completo</span>
          </Link>

          {whatsappNumber && (
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[1.5px] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar com a Consultora</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Wishlist Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayItems.map((product) => {
          const installmentValue = Math.floor(product.priceInCents / 10)
          return (
            <div
              key={product.id}
              className="group bg-white flex flex-col justify-between border border-[#E2E2E2] hover:border-black transition-all duration-300"
            >
              {/* 3:4 Aspect Ratio Image */}
              <div className="relative w-full aspect-3/4 bg-[#F2F2F2] overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
                    <ImageOff className="w-6 h-6 mb-1 opacity-40" />
                    <span className="text-[10px] uppercase tracking-wider">Foto em Breve</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-[13px] font-normal tracking-[0.5px] uppercase text-black line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  <div className="mt-2.5">
                    <p className="text-sm sm:text-base font-semibold text-black tracking-tight">
                      {formatCurrencyBRL(product.priceInCents)}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                      ou até 10x de {formatCurrencyBRL(installmentValue)} sem juros
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Summary & WhatsApp CTA */}
      <div className="bg-white border border-[#E2E2E2] p-6 text-center space-y-4 max-w-xl mx-auto mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-[2px] text-black">
          Atendimento Personalizado
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Tire dúvidas sobre tecidos, caimento e disponibilidade de tamanhos com a Consultora Canal Concept.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {whatsappNumber && (
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[2px] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Lista no WhatsApp</span>
            </button>
          )}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E2E2E2] hover:border-black text-black text-xs uppercase tracking-[2px] transition-colors"
          >
            <span>Ver Mais Peças</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
