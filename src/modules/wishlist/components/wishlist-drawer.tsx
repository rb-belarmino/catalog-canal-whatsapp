"use client";

import { X, Heart, MessageCircle, AlertCircle, ShoppingBag } from "lucide-react";
import { formatCurrencyBRL } from "@/shared/utils";
import { useWishlist } from "../context";
import { WishlistItemRow } from "./wishlist-item-row";
import { buildWhatsAppUrl, dispatchToWhatsApp } from "../whatsapp";

interface WishlistDrawerProps {
  whatsappNumber: string;
  storeName?: string;
}

export function WishlistDrawer({ whatsappNumber, storeName }: WishlistDrawerProps) {
  const {
    items,
    totalInCents,
    totalCount,
    removeItem,
    clearWishlist,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useWishlist();

  if (!isDrawerOpen) return null;

  const isConfigured = Boolean(whatsappNumber && whatsappNumber.replace(/\D/g, ""));
  const isEmpty = items.length === 0;

  function handleSendToWhatsApp() {
    if (isEmpty || !isConfigured) return;

    const url = buildWhatsAppUrl({
      items,
      totalInCents,
      whatsappNumber,
      storeName,
    });

    if (url) {
      dispatchToWhatsApp(url);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 leading-none">
                  Minha Lista de Desejos
                </h3>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  {totalCount} {totalCount === 1 ? "peça selecionada" : "peças selecionadas"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEmpty && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 rounded-lg transition-colors"
                >
                  Limpar
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List / Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-stone-300" />
                </div>
                <h4 className="text-sm font-semibold text-stone-700">
                  Sua lista está vazia
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                  Navegue pelo catálogo e toque no botão de coração nas peças que você mais gostar para adicioná-las aqui!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <WishlistItemRow
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>

          {/* Footer & WhatsApp CTA */}
          <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/70 space-y-3">
            <div className="flex items-center justify-between text-stone-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Total Estimado
              </span>
              <span className="text-lg font-extrabold text-stone-950">
                {formatCurrencyBRL(totalInCents)}
              </span>
            </div>

            {!isConfigured && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>O contato do WhatsApp não está disponível no momento.</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              disabled={isEmpty || !isConfigured}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold rounded-2xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enviar para a Vendedora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
