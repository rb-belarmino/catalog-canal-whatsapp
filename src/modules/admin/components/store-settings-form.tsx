"use client";

import { useState } from "react";
import { MessageCircle, Store, Check, Loader2, Megaphone } from "lucide-react";
import { updateShopConfigAction } from "../actions";

interface StoreSettingsFormProps {
  initialStoreName: string;
  initialWhatsappNumber: string;
  initialTopAnnouncement?: string;
}

export function StoreSettingsForm({
  initialStoreName,
  initialWhatsappNumber,
  initialTopAnnouncement = "FRETE GRÁTIS ACIMA DE R$ 599,00 | PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX",
}: StoreSettingsFormProps) {
  const [storeName, setStoreName] = useState(initialStoreName);
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber);
  const [topAnnouncement, setTopAnnouncement] = useState(initialTopAnnouncement);
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
        topAnnouncement,
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
            onChange={(e) => setStoreName(e.target.value)}
            required
            maxLength={80}
            placeholder="Canal Concept"
            className="w-full px-3 py-2 bg-neutral-50 border border-[#E2E2E2] text-black text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>WhatsApp de Contato</span>
            <span className="text-[10px] text-neutral-400 font-normal">DDI + DDD + Número</span>
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
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-[#E2E2E2] text-black text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-neutral-500" />
            Comunicados da Barra Superior (Separar itens por |)
          </span>
          <span className="text-[10px] text-neutral-400 font-normal">Máx. 255 caracteres</span>
        </label>
        <input
          type="text"
          value={topAnnouncement}
          onChange={(e) => setTopAnnouncement(e.target.value)}
          maxLength={255}
          placeholder="FRETE GRÁTIS ACIMA DE R$ 599,00 | PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX"
          className="w-full px-3 py-2 bg-neutral-50 border border-[#E2E2E2] text-black text-sm focus:outline-none focus:border-black transition-colors"
        />
        <p className="text-[10px] text-neutral-400 mt-1">
          Exemplo: FRETE GRÁTIS ACIMA DE R$ 599,00 | PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX
        </p>
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
  );
}
