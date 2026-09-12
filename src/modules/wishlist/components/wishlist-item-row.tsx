"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { formatCurrencyBRL } from "@/shared/utils";
import type { WishlistItem } from "../context";

interface WishlistItemRowProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
}

export function WishlistItemRow({ item, onRemove }: WishlistItemRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-stone-50 border border-stone-200/70 rounded-2xl">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200/60 shrink-0 border border-stone-200/50">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-stone-900 truncate leading-snug">
            {item.name}
          </h4>
          <p className="text-xs font-bold text-stone-900 mt-1">
            {formatCurrencyBRL(item.priceInCents)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remover ${item.name} da lista`}
        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
