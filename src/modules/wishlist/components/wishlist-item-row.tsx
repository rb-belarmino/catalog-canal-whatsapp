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
    <div className="flex items-center justify-between gap-3 p-3 bg-white border border-[#E2E2E2] hover:border-black transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-14 h-18 overflow-hidden bg-neutral-100 shrink-0 border border-[#E2E2E2]">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-normal tracking-[0.5px] uppercase text-black truncate leading-tight">
            {item.name}
          </h4>
          <p className="text-xs font-semibold text-black mt-1">
            {formatCurrencyBRL(item.priceInCents)}
          </p>
          <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-0.5">
            ou até 10x de {formatCurrencyBRL(Math.floor(item.priceInCents / 10))} sem juros
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remover ${item.name} da lista de desejos`}
        className="p-2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
