"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Check, ImageOff } from "lucide-react";
import { formatCurrencyBRL } from "@/shared/utils";
import { useWishlist } from "@/modules/wishlist/context";
import type { CatalogProduct } from "../queries";

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { hasItem, addItem } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const isSelected = hasItem(product.id);

  function handleToggleWishlist() {
    addItem(product);
  }

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Image Container */}
      <div className="relative w-full aspect-3/4 bg-stone-100 overflow-hidden">
        {!imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50">
            <ImageOff className="w-8 h-8 mb-1 opacity-50" />
            <span className="text-[11px]">Imagem indisponível</span>
          </div>
        )}

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isSelected ? "Peça já na lista de desejos" : "Adicionar à lista de desejos"}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-150 shadow-sm ${
            isSelected
              ? "bg-rose-500 text-white scale-105"
              : "bg-white/90 text-stone-700 hover:bg-white hover:text-rose-500 active:scale-90"
          }`}
        >
          <Heart className={`w-4 h-4 ${isSelected ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-stone-800 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-base font-bold text-stone-950 mt-1.5">
            {formatCurrencyBRL(product.priceInCents)}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            isSelected
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
              : "bg-stone-900 hover:bg-stone-800 text-white active:scale-[0.98] shadow-xs"
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Adicionada à Lista</span>
            </>
          ) : (
            <>
              <Heart className="w-3.5 h-3.5" />
              <span>Quero essa peça</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
