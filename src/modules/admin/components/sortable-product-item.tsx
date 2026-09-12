"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit2, Trash2 } from "lucide-react";
import { formatCurrencyBRL } from "@/shared/utils";
import type { EditableProduct } from "./product-form-modal";

interface SortableProductItemProps {
  product: EditableProduct;
  onEdit: (product: EditableProduct) => void;
  onDelete: (id: string, name: string) => void;
}

export function SortableProductItem({
  product,
  onEdit,
  onDelete,
}: SortableProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3.5 bg-white border border-stone-200/80 rounded-xl transition-shadow ${
        isDragging
          ? "opacity-50 shadow-lg ring-2 ring-stone-900/10 z-20"
          : "hover:border-stone-300"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
          title="Arraste para reordenar"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Thumbnail */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/60 shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-stone-900 truncate">
              {product.name}
            </p>
            {!product.active && (
              <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded">
                Inativo
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-stone-500 mt-0.5">
            {formatCurrencyBRL(product.priceInCents)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          title="Editar peça"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id, product.name)}
          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          title="Excluir peça"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
