'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ArrowLeft, ImageOff } from 'lucide-react'
import { formatCurrencyBRL } from '@/shared/utils'
import { useWishlist } from '@/modules/wishlist/context'
import type { CatalogProduct } from '@/modules/catalog/queries'

interface WishlistListViewerProps {
  initialProducts: CatalogProduct[]
  whatsappNumber: string
  storeName?: string
}

export function WishlistListViewer({
  initialProducts
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

  const isEmpty = isClient && displayItems.length === 0

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
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white border border-[#E2E2E2] p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[2px] text-neutral-400 font-medium">
            Resumo da Seleção
          </span>
          <p className="text-sm font-semibold uppercase tracking-[1.5px] text-black mt-0.5">
            {displayItems.length} {displayItems.length === 1 ? 'peça selecionada' : 'peças selecionadas'}
          </p>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {displayItems.map((product) => {
          const installmentValue = Math.floor(product.priceInCents / 10)
          return (
            <div
              key={product.id}
              className="bg-white border border-[#E2E2E2] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-black transition-colors"
            >
              {/* 3:4 Aspect Image */}
              <div className="relative w-28 sm:w-24 aspect-3/4 bg-[#F2F2F2] overflow-hidden shrink-0 border border-[#E2E2E2]">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
                    <ImageOff className="w-5 h-5 mb-1 opacity-40" />
                    <span className="text-[9px] uppercase tracking-wider">Sem foto</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-normal tracking-[0.5px] uppercase text-black leading-tight">
                  {product.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-base sm:text-lg font-bold text-black tracking-tight">
                    {formatCurrencyBRL(product.priceInCents)}
                  </span>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                    • até 10x de {formatCurrencyBRL(installmentValue)} s/ juros
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[2px] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explorar Coleção Completa</span>
        </Link>
      </div>
    </div>
  )
}
