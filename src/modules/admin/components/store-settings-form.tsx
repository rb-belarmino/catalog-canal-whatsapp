"use client";

import { useState } from "react";
import { MessageCircle, Store, Check, Loader2 } from "lucide-react";
import { updateShopConfigAction } from "../actions";

interface StoreSettingsFormProps {
  initialStoreName: string;
  initialWhatsappNumber: string;
}

export function StoreSettingsForm({
  initialStoreName,
  initialWhatsappNumber,
}: StoreSettingsFormProps) {
  const [storeName, setStoreName] = useState(initialStoreName);
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await updateShopConfigAction({
        storeName,
        whatsappNumber,
      });

      if (!res.success) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Configurações salvas com sucesso!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      setErrorMsg("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
          <Store className="w-4 h-4 text-stone-700" />
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
        <div className="p-2.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
            Nome da Loja
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            maxLength={80}
            placeholder="Ex: Boutique Elegance"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>WhatsApp de Contato</span>
            <span className="text-[10px] text-stone-400 font-normal">DDI + DDD + Número</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
              <MessageCircle className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Ex: 5511999998888"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs font-medium rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configurações"
          )}
        </button>
      </div>
    </form>
  );
}
