"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "../context";

export function WishlistFloatingButton() {
  const { totalCount, setIsDrawerOpen } = useWishlist();

  return (
    <button
      type="button"
      onClick={() => setIsDrawerOpen(true)}
      aria-label="Abrir Lista de Desejos"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white rounded-full shadow-xl hover:bg-stone-800 active:scale-95 transition-all group"
    >
      <div className="relative">
        <Heart className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform fill-rose-400" />
        {totalCount > 0 && (
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
            {totalCount}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold pr-1">
        Lista de Desejos {totalCount > 0 && `(${totalCount})`}
      </span>
    </button>
  );
}
