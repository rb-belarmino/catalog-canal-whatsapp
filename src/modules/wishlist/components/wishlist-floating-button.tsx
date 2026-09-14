'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '../context'

export function WishlistFloatingButton() {
  const { totalCount, setIsDrawerOpen } = useWishlist()

  if (totalCount === 0) return null

  return (
    <button
      type="button"
      data-testid="floating-wishlist-button"
      onClick={() => setIsDrawerOpen(true)}
      aria-label={`Abrir Lista de Desejos com ${totalCount} itens`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 bg-black text-white shadow-2xl hover:bg-neutral-800 active:scale-95 transition-all duration-200 cursor-pointer select-none"
    >
      <div className="relative">
        <Heart className="w-4 h-4 text-white fill-white" />
        <span className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-[#FF005C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {totalCount}
        </span>
      </div>
      <span className="text-xs font-normal tracking-canal-wide uppercase">
        Ver Lista de Desejos ({totalCount})
      </span>
    </button>
  )
}
