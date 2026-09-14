'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Heart, Check, ImageOff, ChevronLeft, ChevronRight, Layers } from 'lucide-react'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

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
  const currentPiece = pieces[currentIndex] || pieces[0]

  // Prepare wishlist item definition for the active piece
  const colorSuffix =
    currentPiece.colors && currentPiece.colors.length > 0
      ? ` (${currentPiece.colors.join(', ')})`
      : ''
  const wishlistName = hasMultiplePieces
    ? `${currentPiece.name}${colorSuffix} - ${product.name}`
    : `${product.name}${colorSuffix}`

  const wishlistItem = {
    id: currentPiece.id,
    name: wishlistName,
    priceInCents: currentPiece.priceInCents,
    imageUrl: product.imageUrl
  }

  const isSelected = hasItem(wishlistItem.id)

  function handleToggleWishlist() {
    toggleItem(wishlistItem)
  }

  function handlePrevPiece(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrentIndex(prev => (prev - 1 + pieces.length) % pieces.length)
  }

  function handleNextPiece(e: React.MouseEvent) {
    e.stopPropagation()
    setCurrentIndex(prev => (prev + 1) % pieces.length)
  }

  // Swipe support for mobile devices
  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null || !hasMultiplePieces) return
    const diffX = touchStartX - e.changedTouches[0].clientX
    if (diffX > 45) {
      // Swiped left -> next piece
      setCurrentIndex(prev => (prev + 1) % pieces.length)
    } else if (diffX < -45) {
      // Swiped right -> prev piece
      setCurrentIndex(prev => (prev - 1 + pieces.length) % pieces.length)
    }
    setTouchStartX(null)
  }

  return (
    <div className="group bg-white flex flex-col justify-between border border-canal-border hover:border-black transition-all duration-300">
      {/* 3:4 Aspect Ratio Image Container with Slide Gestures */}
      <div
        className="relative w-full aspect-3/4 bg-canal-bg overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

        {/* Badge: Look Composto */}
        {hasMultiplePieces && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-black/80 backdrop-blur-xs text-white text-[9px] uppercase tracking-[1.5px] px-2 py-1 flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3" />
            <span>{pieces.length} Peças</span>
          </div>
        )}

        {/* Quick Wishlist Favorite Icon for currently active piece */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            isSelected
              ? `Remover ${currentPiece.name} da lista de desejos`
              : `Adicionar ${currentPiece.name} à lista de desejos`
          }
          className={`absolute top-2.5 right-2.5 z-10 p-2 transition-all duration-200 cursor-pointer ${
            isSelected
              ? 'bg-black text-white shadow-sm'
              : 'bg-white/85 text-black hover:bg-white hover:text-black shadow-xs'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : ''}`} />
        </button>

        {/* Slide Arrows for Multi-piece Looks */}
        {hasMultiplePieces && (
          <>
            <button
              type="button"
              onClick={handlePrevPiece}
              aria-label="Peça anterior deste look"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/85 hover:bg-white text-black shadow-md opacity-85 hover:opacity-100 transition-opacity cursor-pointer sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextPiece}
              aria-label="Próxima peça deste look"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/85 hover:bg-white text-black shadow-md opacity-85 hover:opacity-100 transition-opacity cursor-pointer sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom dots on photo */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1.5 z-10 pointer-events-none">
              {pieces.map((p, idx) => (
                <span
                  key={p.id}
                  className={`h-1.5 transition-all duration-200 ${
                    idx === currentIndex
                      ? 'w-4 bg-black'
                      : 'w-1.5 bg-black/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Interactive Piece Tabs for Composed Looks */}
      {hasMultiplePieces && (
        <div className="flex items-center gap-1 px-3 pt-2.5 pb-1 border-b border-canal-border bg-neutral-50/70 overflow-x-auto no-scrollbar">
          {pieces.map((p, idx) => {
            const active = idx === currentIndex
            const isPieceFavorited = hasItem(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`text-[10px] uppercase tracking-[1px] py-1 px-2.5 transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                  active
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
                }`}
              >
                <span>{p.name}</span>
                {isPieceFavorited && (
                  <span
                    title="Na Lista de Desejos"
                    className={`w-1.5 h-1.5 rounded-full ${
                      active ? 'bg-white' : 'bg-black'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Product Details Area with Smooth Transition */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Look Header or Piece Name */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[10px] uppercase tracking-canal-wide text-neutral-500 font-medium">
              {product.name}
            </span>
            {hasMultiplePieces && (
              <span className="text-[9px] uppercase tracking-wider text-neutral-400">
                {currentIndex + 1}/{pieces.length}
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-[13px] font-medium tracking-[0.5px] uppercase text-black line-clamp-1 leading-tight mt-1">
            {currentPiece.name}
          </h3>

          {/* Colors available */}
          {currentPiece.colors && currentPiece.colors.length > 0 && (
            <p className="text-[11px] text-neutral-600 tracking-wide mt-1 line-clamp-1">
              Cores: <span className="font-normal text-black">{currentPiece.colors.join(', ')}</span>
            </p>
          )}

          {/* Price */}
          <div className="mt-2">
            <p className="text-sm sm:text-base font-semibold text-black tracking-tight">
              {formatCurrencyBRL(currentPiece.priceInCents)}
            </p>
          </div>
        </div>

        {/* Action Button for the active piece */}
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleToggleWishlist}
            variant={isSelected ? 'outline' : 'default'}
            size="sm"
            className="w-full h-9 text-[10px] sm:text-[11px] tracking-[1.5px] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="truncate">
                  {hasMultiplePieces ? `${currentPiece.name} na Lista` : 'Na Lista de Desejos'}
                </span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5" />
                <span className="truncate">
                  {hasMultiplePieces ? `Adicionar ${currentPiece.name}` : 'Adicionar aos Desejos'}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
