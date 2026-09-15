'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Heart, Check, ImageOff } from 'lucide-react'
import { formatCurrencyBRL } from '@/shared/utils'
import { useWishlist } from '@/modules/wishlist/context'
import { Button } from '@/shared/components/ui/button'
import type { CatalogProduct, CatalogPiece } from '../queries'

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlist()
  const [imageError, setImageError] = useState(false)

  // Normalize pieces list
  const pieces: CatalogPiece[] = useMemo(() => {
    if (product.pieces && product.pieces.length > 0) {
      return product.pieces
    }
    return [
      {
        id: product.id,
        name: product.name,
        priceInCents: product.priceInCents
      }
    ]
  }, [product])

  const hasMultiplePieces = pieces.length > 1
  const singlePiece = pieces[0]

  // For single-piece looks, quick favorite status
  const isSingleSelected = hasItem(singlePiece.id)

  function handleToggleSinglePiece() {
    const colorSuffix =
      singlePiece.colors && singlePiece.colors.length > 0
        ? ` (${singlePiece.colors.join(', ')})`
        : ''
    toggleItem({
      id: singlePiece.id,
      name: `${product.name}${colorSuffix}`,
      priceInCents: singlePiece.priceInCents,
      imageUrl: product.imageUrl
    })
  }

  function handleTogglePiece(piece: CatalogPiece) {
    const colorSuffix =
      piece.colors && piece.colors.length > 0
        ? ` (${piece.colors.join(', ')})`
        : ''
    const wishlistName = `${piece.name}${colorSuffix} - ${product.name}`

    toggleItem({
      id: piece.id,
      name: wishlistName,
      priceInCents: piece.priceInCents,
      imageUrl: product.imageUrl
    })
  }

  return (
    <div className="group bg-white flex flex-col justify-between border border-canal-border hover:border-black transition-all duration-300">
      {/* 3:4 Aspect Ratio Image Container */}
      <div className="relative w-full aspect-3/4 bg-canal-bg overflow-hidden select-none">
        {!imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
            <ImageOff className="w-6 h-6 mb-1 opacity-40" />
            <span className="text-[10px] uppercase tracking-wider">
              Foto em Breve
            </span>
          </div>
        )}

      </div>

      {/* Description Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        {!hasMultiplePieces ? (
          /* Single-piece layout (harmonious modern layout) */
          <div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-[13px] font-medium tracking-[0.5px] uppercase text-black line-clamp-2 leading-tight">
                {product.name}
              </h3>

              {singlePiece.colors && singlePiece.colors.length > 0 && (
                <p className="text-[10px] text-neutral-500 tracking-wide mt-0.5 line-clamp-1">
                  Cores: {singlePiece.colors.join(', ')}
                </p>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-canal-border/70 flex items-center justify-between gap-2">
              <div>
                <span className="text-sm sm:text-base font-semibold text-black tracking-tight">
                  {formatCurrencyBRL(singlePiece.priceInCents)}
                </span>
              </div>

              <Button
                type="button"
                onClick={handleToggleSinglePiece}
                aria-label={
                  isSingleSelected
                    ? 'Remover da lista de desejos'
                    : 'Adicionar aos desejos'
                }
                variant={isSingleSelected ? 'outline' : 'default'}
                size="sm"
                className="h-8 px-3 text-[10px] sm:text-[11px] tracking-[1.5px] uppercase flex items-center gap-1.5 cursor-pointer"
              >
                {isSingleSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Na Lista</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Composed look layout (compact horizontal rows without redundant look title) */
          <div className="space-y-2.5 divide-y divide-canal-border/50">
            {pieces.map((piece, idx) => {
              const isSelected = hasItem(piece.id)
                return (
                  <div
                    key={piece.id}
                    className={`flex items-center justify-between gap-2 ${
                      idx > 0 ? 'pt-2.5' : ''
                    }`}
                  >
                    {/* Left: Name and Colors */}
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-xs font-medium uppercase tracking-[0.5px] text-black truncate leading-tight">
                        {piece.name}
                      </p>
                      {piece.colors && piece.colors.length > 0 && (
                        <p className="text-[10px] text-neutral-500 tracking-wide truncate mt-0.5">
                          {piece.colors.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Right: Price & Inline Action Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs sm:text-[13px] font-semibold text-black tracking-tight">
                        {formatCurrencyBRL(piece.priceInCents)}
                      </span>

                      <Button
                        type="button"
                        onClick={() => handleTogglePiece(piece)}
                        aria-label={
                          isSelected
                            ? `Remover ${piece.name} da lista de desejos`
                            : `Adicionar ${piece.name} à lista de desejos`
                        }
                        variant={isSelected ? 'outline' : 'default'}
                        size="sm"
                        className="h-7 px-2.5 text-[9px] sm:text-[10px] tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Salvo</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3 h-3" />
                            <span>Adicionar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
        )}
      </div>
    </div>
  )
}
