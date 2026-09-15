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
    <div className="group bg-white flex flex-col border border-canal-border hover:border-black transition-all duration-300 shadow-xs">
      {/* Pure 3:4 Aspect Ratio Image Container without badges */}
      <div className="relative w-full aspect-3/4 bg-canal-bg overflow-hidden select-none">
        {!imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {!hasMultiplePieces ? (
          /* Single-piece layout: Title is displayed */
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="mb-3 border-b border-canal-border/60 pb-2.5">
                <h3 className="text-sm sm:text-base font-semibold tracking-[0.8px] uppercase text-black leading-snug break-words">
                  {product.name}
                </h3>
              </div>

              <div className="space-y-1.5">
                {singlePiece.colors && singlePiece.colors.length > 0 && (
                  <div className="text-xs text-neutral-700">
                    <span className="font-medium text-black">Cores disponíveis: </span>
                    <span className="break-words">{singlePiece.colors.join(', ')}</span>
                  </div>
                )}

                <div className="pt-2">
                  <span className="text-base sm:text-lg font-bold text-black tracking-tight">
                    {formatCurrencyBRL(singlePiece.priceInCents)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-canal-border/60">
              <Button
                type="button"
                onClick={handleToggleSinglePiece}
                aria-label={
                  isSingleSelected
                    ? 'Remover da lista de desejos'
                    : 'Adicionar aos desejos'
                }
                variant={isSingleSelected ? 'outline' : 'default'}
                className={`w-full min-h-9 py-1.5 px-2 text-[10px] sm:text-[11px] tracking-[1.2px] uppercase flex items-center justify-center gap-1.5 cursor-pointer font-semibold transition-all leading-tight ${
                  isSingleSelected
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                {isSingleSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Na Lista</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 shrink-0" />
                    <span>Adicionar à Lista</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Composed look layout: No look title, pure pieces list */
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="space-y-3.5 divide-y divide-canal-border/50">
                {pieces.map((piece, idx) => {
                  const isSelected = hasItem(piece.id)
                  return (
                    <div
                      key={piece.id}
                      className={`flex flex-col gap-1.5 ${idx > 0 ? 'pt-3.5' : ''}`}
                    >
                      {/* Top row: Piece Name and Price */}
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.5px] text-black break-words">
                          {piece.name}
                        </h4>
                        <span className="text-xs sm:text-sm font-bold text-black tracking-tight shrink-0">
                          {formatCurrencyBRL(piece.priceInCents)}
                        </span>
                      </div>

                      {/* Colors row: Always 100% visible */}
                      {piece.colors && piece.colors.length > 0 && (
                        <p className="text-[11px] sm:text-xs text-neutral-600 tracking-wide break-words">
                          <span className="font-medium text-neutral-800">Cores: </span>
                          {piece.colors.join(', ')}
                        </p>
                      )}

                      {/* Individual Piece Wishlist Button */}
                      <div className="pt-1">
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
                          className={`w-full h-8 text-[10px] sm:text-[11px] tracking-[1.2px] uppercase flex items-center justify-center gap-1.5 cursor-pointer font-medium transition-all ${
                            isSelected
                              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                              : 'bg-black text-white hover:bg-neutral-800'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{piece.name} na Lista</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-3.5 h-3.5" />
                              <span>Adicionar {piece.name}</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
