"use client";

import { MessageCircle, AlertCircle, ShoppingBag } from "lucide-react";
import { formatCurrencyBRL } from "@/shared/utils";
import { useWishlist } from "../context";
import { WishlistItemRow } from "./wishlist-item-row";
import { buildWhatsAppUrl, dispatchToWhatsApp } from "../whatsapp";
import { Sheet } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";

interface WishlistDrawerProps {
  whatsappNumber: string;
  storeName?: string;
}

export function WishlistDrawer({
  whatsappNumber,
  storeName = "Canal Concept",
}: WishlistDrawerProps) {
  const {
    items,
    totalInCents,
    totalCount,
    removeItem,
    clearWishlist,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useWishlist();

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

  const installmentsCount = 10;
  const installmentCents = Math.round(totalInCents / installmentsCount);

  return (
    <Sheet
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      title="Sacola de Desejos"
      description={`${totalCount} ${totalCount === 1 ? "peça selecionada" : "peças selecionadas"}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top bar with Clear button */}
        {!isEmpty && (
          <div className="flex justify-end pb-3 mb-2 border-b border-[#E2E2E2]">
            <button
              type="button"
              onClick={clearWishlist}
              className="text-[11px] uppercase tracking-[1.5px] text-neutral-400 hover:text-black transition-colors cursor-pointer"
            >
              Limpar Sacola
            </button>
          </div>
        )}

        {/* Item List / Empty State */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 my-16">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-[2px] text-black">
                Sua Sacola está Vazia
              </h3>
              <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
                Navegue pelas peças da Canal Concept e adicione seus itens favoritos para solicitar atendimento no WhatsApp.
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

        {/* Footer with Subtotal & WhatsApp CTA */}
        {!isEmpty && (
          <div className="pt-4 border-t border-[#E2E2E2] bg-white space-y-3 mt-auto">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-black">
                <span className="text-[11px] font-medium uppercase tracking-[2px] text-neutral-500">
                  Total Estimado
                </span>
                <span className="text-base font-bold text-black tracking-tight">
                  {formatCurrencyBRL(totalInCents)}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 text-right uppercase tracking-wider">
                ou até {installmentsCount}x de {formatCurrencyBRL(installmentCents)} sem juros
              </p>
            </div>

            {!isConfigured && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>O número do WhatsApp da vendedora não está configurado.</span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleSendToWhatsApp}
              disabled={isEmpty || !isConfigured}
              className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-[2px] uppercase flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Finalizar no WhatsApp</span>
            </Button>

            <p className="text-[10px] text-center text-neutral-400 uppercase tracking-widest">
              Alinhe tamanhos e frete com a vendedora
            </p>
          </div>
        )}
      </div>
    </Sheet>
  );
}
