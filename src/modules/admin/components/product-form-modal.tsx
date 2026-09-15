'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Upload, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadthing-client'
import { parseBRLToCents, formatCurrencyBRL } from '@/shared/utils'
import { createProductAction, updateProductAction } from '../actions'

export interface EditablePiece {
  id?: string
  name: string
  priceInCents: number
  colors?: string[]
}

export interface EditableProduct {
  id: string
  name: string
  priceInCents: number
  imageUrl: string
  active: boolean
  pieces?: EditablePiece[] | null
}

interface PieceItemState {
  id?: string
  name: string
  priceStr: string
  colorsStr: string
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
  const [isMultiple, setIsMultiple] = useState(false)
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [singlePriceStr, setSinglePriceStr] = useState('')
  const [singleColorsStr, setSingleColorsStr] = useState('')
  const [active, setActive] = useState(true)
  const [pieces, setPieces] = useState<PieceItemState[]>([
    { name: '', priceStr: '', colorsStr: '' }
  ])
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (productToEdit) {
      const hasMultiple = Boolean(
        productToEdit.pieces && productToEdit.pieces.length > 1
      )
      setIsMultiple(hasMultiple)
      setName(productToEdit.name)
      setImageUrl(productToEdit.imageUrl)
      setActive(productToEdit.active)

      if (hasMultiple) {
        setPieces(
          productToEdit.pieces!.map(p => ({
            id: p.id,
            name: p.name,
            priceStr: formatCurrencyBRL(p.priceInCents)
              .replace('R$', '')
              .trim(),
            colorsStr: p.colors ? p.colors.join(', ') : ''
          }))
        )
      } else {
        const firstPiece = productToEdit.pieces?.[0]
        setSinglePriceStr(
          formatCurrencyBRL(
            firstPiece?.priceInCents ?? productToEdit.priceInCents
          )
            .replace('R$', '')
            .trim()
        )
        setSingleColorsStr(
          firstPiece?.colors ? firstPiece.colors.join(', ') : ''
        )
        setPieces([
          {
            id: firstPiece?.id || productToEdit.id,
            name: firstPiece?.name || productToEdit.name,
            priceStr: formatCurrencyBRL(
              firstPiece?.priceInCents ?? productToEdit.priceInCents
            )
              .replace('R$', '')
              .trim(),
            colorsStr: firstPiece?.colors ? firstPiece.colors.join(', ') : ''
          }
        ])
      }
    } else {
      setIsMultiple(false)
      setName('')
      setImageUrl('')
      setSinglePriceStr('')
      setSingleColorsStr('')
      setPieces([{ name: '', priceStr: '', colorsStr: '' }])
      setActive(true)
    }
    setError(null)
  }, [productToEdit, isOpen])

  if (!isOpen) return null

  function handleAddPiece() {
    setPieces(prev => [...prev, { name: '', priceStr: '', colorsStr: '' }])
  }

  function handleRemovePiece(index: number) {
    if (pieces.length <= 1) return
    setPieces(prev => prev.filter((_, i) => i !== index))
  }

  function handleUpdatePiece(
    index: number,
    field: keyof PieceItemState,
    value: string
  ) {
    setPieces(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      setError(
        isMultiple
          ? 'Por favor, informe o título do look/conjunto (mínimo 2 caracteres).'
          : 'Por favor, informe o nome da peça (mínimo 2 caracteres).'
      )
      return
    }

    if (!imageUrl) {
      setError('Por favor, faça o upload de uma foto.')
      return
    }

    let resolvedPiecesPayload: Array<{
      id?: string
      name: string
      priceInCents: number
      colors?: string[]
    }> = []

    if (!isMultiple) {
      const cents = parseBRLToCents(singlePriceStr)
      if (!cents || cents <= 0) {
        setError('Por favor, digite um preço válido em reais (ex: 189,90).')
        return
      }

      const colors = singleColorsStr
        .split(',')
        .map(c => c.trim())
        .filter(Boolean)

      resolvedPiecesPayload = [
        {
          id: productToEdit?.pieces?.[0]?.id,
          name: trimmedName,
          priceInCents: cents,
          colors
        }
      ]
    } else {
      if (pieces.length === 0) {
        setError('O conjunto precisa ter ao menos uma peça cadastrada.')
        return
      }

      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i]
        const pName = p.name.trim()
        if (!pName || pName.length < 2) {
          setError(
            `A peça #${i + 1} deve ter um nome válido (mínimo 2 caracteres).`
          )
          return
        }

        const cents = parseBRLToCents(p.priceStr)
        if (!cents || cents <= 0) {
          setError(
            `O preço da peça #${i + 1} ("${pName}") é inválido (ex: 189,90).`
          )
          return
        }

        const colors = p.colorsStr
          .split(',')
          .map(c => c.trim())
          .filter(Boolean)

        resolvedPiecesPayload.push({
          id: p.id,
          name: pName,
          priceInCents: cents,
          colors
        })
      }
    }

    setIsSaving(true)
    try {
      if (productToEdit) {
        const res = await updateProductAction({
          id: productToEdit.id,
          name: trimmedName,
          imageUrl,
          active,
          pieces: resolvedPiecesPayload
        })
        if (!res.success) {
          setError(res.error)
          setIsSaving(false)
          return
        }
      } else {
        const res = await createProductAction({
          name: trimmedName,
          imageUrl,
          pieces: resolvedPiecesPayload
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
      <div className="w-full max-w-xl bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">
            {productToEdit
              ? isMultiple
                ? 'Editar Conjunto'
                : 'Editar Peça Única'
              : isMultiple
              ? 'Cadastrar Novo Conjunto'
              : 'Cadastrar Peça Única'}
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
          className="p-6 space-y-5 max-h-[85vh] overflow-y-auto"
        >
          {error && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Mode Selector: Peça Única vs Conjunto */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setIsMultiple(false)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isMultiple
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              👗 Look de Peça Única
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMultiple(true)
                if (pieces.length < 2) {
                  setPieces([
                    {
                      name: name || '',
                      priceStr: singlePriceStr || '',
                      colorsStr: singleColorsStr || ''
                    },
                    { name: '', priceStr: '', colorsStr: '' }
                  ])
                }
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isMultiple
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              ✨ Conjunto (Múltiplas Peças)
            </button>
          </div>

          {/* Photo Upload / Preview */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
              Foto {isMultiple ? 'do Look / Conjunto' : 'da Peça'} (Máx 8MB)
            </label>

            {imageUrl ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 group">
                <Image
                  src={imageUrl}
                  alt="Prévia da foto"
                  fill
                  className="object-cover"
                  sizes="(max-width: 600px) 100vw, 600px"
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
                      'bg-stone-900 text-white text-xs px-4 py-2 rounded-lg font-medium cursor-pointer',
                    container: 'py-4',
                    label: 'text-stone-600 text-sm',
                    allowedContent: 'text-stone-400 text-xs'
                  }}
                  content={{
                    label: 'Arraste a foto aqui ou clique para selecionar',
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

          {!isMultiple ? (
            /* --- FLUXO PEÇA ÚNICA --- */
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Nome da Peça *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder="Ex: Vestido Midi Linho Cru"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Preço (R$) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-medium text-stone-400 pointer-events-none">
                    R$
                  </span>
                  <input
                    type="text"
                    value={singlePriceStr}
                    onChange={e => setSinglePriceStr(e.target.value)}
                    required
                    placeholder="289,90"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Cores disponíveis (opcional, separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={singleColorsStr}
                  onChange={e => setSingleColorsStr(e.target.value)}
                  placeholder="Ex: Off-White, Preto, Marrom"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>
            </div>
          ) : (
            /* --- FLUXO CONJUNTO (MÚLTIPLAS PEÇAS) --- */
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Título do Look / Conjunto *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder="Ex: Look 08 - Conjunto Linho Alfaiataria"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Peças do Conjunto ({pieces.length})
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Cadastre cada item com seu respectivo valor
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPiece}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Peça
                  </button>
                </div>

                <div className="space-y-3">
                  {pieces.map((piece, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          Peça #{index + 1}
                        </span>
                        {pieces.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePiece(index)}
                            className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                            title="Remover peça"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-medium text-stone-600 mb-1">
                            Nome da Peça *
                          </label>
                          <input
                            type="text"
                            value={piece.name}
                            onChange={e =>
                              handleUpdatePiece(index, 'name', e.target.value)
                            }
                            required
                            placeholder="Ex: Colete Linho Estruturado"
                            className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-stone-600 mb-1">
                            Preço (R$) *
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-medium text-stone-400 pointer-events-none">
                              R$
                            </span>
                            <input
                              type="text"
                              value={piece.priceStr}
                              onChange={e =>
                                handleUpdatePiece(
                                  index,
                                  'priceStr',
                                  e.target.value
                                )
                              }
                              required
                              placeholder="189,90"
                              className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-600 mb-1">
                          Cores disponíveis (opcional, separadas por vírgula)
                        </label>
                        <input
                          type="text"
                          value={piece.colorsStr}
                          onChange={e =>
                            handleUpdatePiece(
                              index,
                              'colorsStr',
                              e.target.value
                            )
                          }
                          placeholder="Ex: Off-White, Areia, Preto"
                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active status toggle if editing */}
          {productToEdit && (
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
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
                Exibir este item no catálogo público
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-sm font-medium rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
