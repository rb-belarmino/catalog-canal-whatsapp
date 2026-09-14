'use client'

import * as React from 'react'
import { MessageCircle, AlertCircle, Heart, Loader2 } from 'lucide-react'
import { useWishlist } from '../context'
import { WishlistItemRow } from './wishlist-item-row'
import { buildWhatsAppUrl, dispatchToWhatsApp } from '../whatsapp'
import { createShortWishlistAction } from '../actions'
import { Sheet } from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'

interface WishlistDrawerProps {
  whatsappNumber: string
  storeName?: string
}

export function WishlistDrawer({
  whatsappNumber,
  storeName = 'Canal Concept'
}: WishlistDrawerProps) {
  const {
    items,
    totalInCents,
    totalCount,
    removeItem,
    clearWishlist,
    isDrawerOpen,
    setIsDrawerOpen
  } = useWishlist()

  const [isGenerating, setIsGenerating] = React.useState(false)

  const isConfigured = Boolean(
    whatsappNumber && whatsappNumber.replace(/\D/g, '')
  )
  const isEmpty = items.length === 0

  async function handleSendToWhatsApp() {
    if (isEmpty || !isConfigured || isGenerating) return

    setIsGenerating(true)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const ids = items.map(i => i.id).filter(Boolean)

      let shareUrl: string | undefined

      try {
        const res = await createShortWishlistAction(ids)
        if (res.success && res.code && origin) {
          shareUrl = `${origin}/lista/${res.code}`
        }
      } catch (err) {
        console.error(
          'Failed to create short wishlist link, using fallback',
          err
        )
      }

      // Fallback if shortener failed or origin is missing
      if (!shareUrl && origin && ids.length > 0) {
        shareUrl = `${origin}/lista?ids=${ids.join(',')}`
      }

      const url = buildWhatsAppUrl({
        items,
        totalInCents,
        whatsappNumber,
        storeName,
        shareUrl
      })

      if (url) {
        dispatchToWhatsApp(url)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Sheet
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      title="Lista de Desejos"
      description={`${totalCount} ${totalCount === 1 ? 'peça selecionada' : 'peças selecionadas'}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top bar with Clear button */}
        {!isEmpty && (
          <div className="flex justify-end pb-3 mb-2 border-b border-canal-border">
            <button
              type="button"
              onClick={clearWishlist}
              className="text-[11px] uppercase tracking-[1.5px] text-neutral-400 hover:text-black transition-colors cursor-pointer"
            >
              Limpar Lista de Desejos
            </button>
          </div>
        )}

        {/* Item List / Empty State */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 my-16">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-[2px] text-black">
                Sua Lista de Desejos está Vazia
              </h3>
              <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
                Navegue pelas peças da Canal Concept e adicione seus itens
                favoritos para solicitar atendimento no WhatsApp.
              </p>
            </div>
          ) : (
            items.map(item => (
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
          <div className="pt-4 border-t border-canal-border bg-white space-y-3 mt-auto">
            {!isConfigured && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  O número do WhatsApp da consultora não está configurado.
                </span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleSendToWhatsApp}
              disabled={isEmpty || !isConfigured || isGenerating}
              className="w-full min-h-12 h-auto py-3 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-[1.5px] uppercase flex items-center justify-center gap-2 text-center disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  <span>Gerando link da lista...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Envie aqui a sua lista e fale com a consultora</span>
                </>
              )}
            </Button>

            <p className="text-[10px] text-center text-neutral-400 uppercase tracking-widest">
              Alinhe tamanhos, tire dúvidas e faça sua reserva
            </p>
          </div>
        )}
      </div>
    </Sheet>
  )
}
