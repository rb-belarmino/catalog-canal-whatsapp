"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Check, ImageOff, ShoppingBag } from "lucide-react";
import { formatCurrencyBRL } from "@/shared/utils";
import { useWishlist } from "@/modules/wishlist/context";
import { Button } from "@/shared/components/ui/button";
import type { CatalogProduct } from "../queries";

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const isSelected = hasItem(product.id);

  function handleToggleWishlist() {
    toggleItem(product);
  }

  // Calculate 10x installment and 5% PIX discount
  const installmentsCount = 10;
  const installmentCents = Math.round(product.priceInCents / installmentsCount);
  const pixPriceCents = Math.round(product.priceInCents * 0.95);

  return (
    <div className="group bg-white flex flex-col justify-between border border-[#E2E2E2] hover:border-black transition-all duration-300">
      {/* 3:4 Aspect Ratio Image Container */}
      <div className="relative w-full aspect-3/4 bg-[#F2F2F2] overflow-hidden">
        {!imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
            <ImageOff className="w-6 h-6 mb-1 opacity-40" />
            <span className="text-[10px] uppercase tracking-wider">Foto em Breve</span>
          </div>
        )}

        {/* Quick Wishlist Favorite Icon */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isSelected ? "Remover da sacola" : "Adicionar à sacola"}
          className={`absolute top-2.5 right-2.5 p-2 transition-all duration-200 cursor-pointer ${
            isSelected
              ? "bg-black text-white"
              : "bg-white/80 text-black hover:bg-white hover:text-black"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSelected ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Product Details (Canal Concept Minimalist Editorial Style) */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-[13px] font-normal tracking-[0.5px] uppercase text-black line-clamp-2 leading-tight">
            {product.name}
          </h3>

          <div className="mt-2.5">
            <p className="text-sm sm:text-base font-semibold text-black tracking-tight">
              {formatCurrencyBRL(product.priceInCents)}
            </p>
            <p className="text-[11px] text-neutral-500 font-normal tracking-wide mt-0.5">
              ou {installmentsCount}x de {formatCurrencyBRL(installmentCents)} sem juros
            </p>
            <p className="text-[10px] font-medium text-emerald-700 tracking-wider uppercase mt-1">
              {formatCurrencyBRL(pixPriceCents)} no PIX (5% OFF)
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleToggleWishlist}
            variant={isSelected ? "outline" : "default"}
            size="sm"
            className="w-full h-9 text-[10px] sm:text-[11px] tracking-[1.5px] uppercase flex items-center justify-center gap-1.5"
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Na Sacola</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Adicionar à Sacola</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
