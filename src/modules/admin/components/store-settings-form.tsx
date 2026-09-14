'use client'

import { useState } from 'react'
import { Store, Check, Loader2 } from 'lucide-react'
import { updateShopConfigAction } from '../actions'

interface StoreSettingsFormProps {
  initialStoreName: string
  initialWhatsappNumber: string
}

function stripCountryCode55(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits.slice(2)
  }
  return digits
}

function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function StoreSettingsForm({
  initialStoreName,
  initialWhatsappNumber
}: StoreSettingsFormProps) {
  const [storeName, setStoreName] = useState(initialStoreName)
  const [phoneInput, setPhoneInput] = useState(() =>
    formatPhoneBR(stripCountryCode55(initialWhatsappNumber))
  )
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneInput(formatPhoneBR(e.target.value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    const rawDigits = phoneInput.replace(/\D/g, '')
    // Auto-prefix Brazil DDI (55) if user provided DDD + number
    const finalPhone =
      rawDigits.length > 0
        ? rawDigits.startsWith('55') && (rawDigits.length === 12 || rawDigits.length === 13)
          ? rawDigits
          : `55${rawDigits}`
        : ''

    try {
      const res = await updateShopConfigAction({
        storeName,
        whatsappNumber: finalPhone
      })

      if (!res.success) {
        setErrorMsg(res.error)
      } else {
        setSuccessMsg('Configurações salvas com sucesso!')
        setTimeout(() => setSuccessMsg(null), 3000)
      }
    } catch {
      setErrorMsg('Erro ao salvar configurações.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E2E2E2] p-5 sm:p-6 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-[2px] text-black flex items-center gap-2">
          <Store className="w-4 h-4 text-black" />
          Configurações da Loja
        </h3>
        {successMsg && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3" />
            {successMsg}
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 text-xs text-rose-600 bg-rose-50 border border-rose-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5">
            Nome da Loja
          </label>
          <input
            type="text"
            value={storeName}
            onChange={e => setStoreName(e.target.value)}
            required
            maxLength={80}
            placeholder="Canal Concept"
            className="w-full px-3 py-2 bg-neutral-50 border border-[#E2E2E2] text-black text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>WhatsApp de Contato</span>
            <span className="text-[10px] text-neutral-400 font-normal">
              Apenas DDD + Número
            </span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 gap-1 border-r border-[#E2E2E2] pr-2.5 my-1.5">
              <span className="text-xs font-medium text-neutral-700">🇧🇷 +55</span>
            </div>
            <input
              type="tel"
              value={phoneInput}
              onChange={handlePhoneChange}
              maxLength={15}
              placeholder="(11) 99999-8888"
              className="w-full pl-[78px] pr-3 py-2 bg-neutral-50 border border-[#E2E2E2] text-black text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">
            O código do país (+55) é inserido automaticamente.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white text-xs uppercase tracking-[1.5px] transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <span>Salvar Configurações</span>
          )}
        </button>
      </div>
    </form>
  )
}
