'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Upload, Loader2, CheckCircle2, ImageIcon } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadthing-client'
import { parseBRLToCents, formatCurrencyBRL } from '@/shared/utils'
import { createProductAction, updateProductAction } from '../actions'

export interface EditableProduct {
  id: string
  name: string
  priceInCents: number
  imageUrl: string
  active: boolean
}

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  productToEdit?: EditableProduct | null
  onSaved: () => void
}

export function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSaved
}: ProductFormModalProps) {
  const [name, setName] = useState('')
  const [priceStr, setPriceStr] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [active, setActive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name)
      setPriceStr(
        formatCurrencyBRL(productToEdit.priceInCents).replace('R$', '').trim()
      )
      setImageUrl(productToEdit.imageUrl)
      setActive(productToEdit.active)
    } else {
      setName('')
      setPriceStr('')
      setImageUrl('')
      setActive(true)
    }
    setError(null)
  }, [productToEdit, isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const priceInCents = parseBRLToCents(priceStr)
    if (!priceInCents) {
      setError('Por favor, digite um preço válido em reais (ex: 89,90).')
      return
    }

    if (!imageUrl) {
      setError('Por favor, faça o upload de uma foto da peça.')
      return
    }

    setIsSaving(true)
    try {
      if (productToEdit) {
        const res = await updateProductAction({
          id: productToEdit.id,
          name,
          priceInCents,
          imageUrl,
          active
        })
        if (!res.success) {
          setError(res.error)
          setIsSaving(false)
          return
        }
      } else {
        const res = await createProductAction({
          name,
          priceInCents,
          imageUrl
        })
        if (!res.success) {
          setError(res.error)
          setIsSaving(false)
          return
        }
      }

      onSaved()
      onClose()
    } catch {
      setError('Ocorreu um erro ao salvar o produto.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">
            {productToEdit ? 'Editar Peça do Catálogo' : 'Cadastrar Nova Peça'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {error && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Photo Upload / Preview */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
              Foto da Peça (Máx 8MB)
            </label>

            {imageUrl ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 group">
                <Image
                  src={imageUrl}
                  alt="Prévia do produto"
                  fill
                  className="object-cover"
                  sizes="(max-width: 500px) 100vw, 500px"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors shadow"
                  title="Trocar imagem"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-emerald-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Foto carregada
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-xl p-4 text-center transition-colors">
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={res => {
                    if (res?.[0]?.url) {
                      setImageUrl(res[0].url)
                    }
                  }}
                  onUploadError={(err: Error) => {
                    setError(`Falha no upload: ${err.message}`)
                  }}
                  appearance={{
                    button:
                      'bg-stone-900 text-white text-xs px-4 py-2 rounded-lg font-medium',
                    container: 'py-4',
                    label: 'text-stone-600 text-sm',
                    allowedContent: 'text-stone-400 text-xs'
                  }}
                  content={{
                    label: 'Arraste uma foto aqui ou clique para selecionar',
                    allowedContent: 'Imagens até 8MB (JPEG, PNG, WEBP)',
                    button: 'Escolher Foto'
                  }}
                />
                <div className="mt-2 text-center">
                  <span className="text-xs text-stone-400">
                    ou use URL direta da imagem:
                  </span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg text-stone-700 placeholder:text-stone-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Nome da Peça
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              placeholder="Ex: Vestido Floral Midi de Linho"
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Preço (R$)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-medium text-stone-400 pointer-events-none">
                R$
              </span>
              <input
                type="text"
                value={priceStr}
                onChange={e => setPriceStr(e.target.value)}
                required
                placeholder="189,90"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
            </div>
          </div>

          {/* Active status toggle if editing */}
          {productToEdit && (
            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={e => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
              />
              <label
                htmlFor="active"
                className="text-sm font-medium text-stone-700 cursor-pointer"
              >
                Exibir esta peça no catálogo público
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-sm font-medium rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Peça'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
