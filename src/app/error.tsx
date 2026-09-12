"use client";

import { useEffect } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { logger } from "@/shared/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("ErrorBoundary", error.message, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fcfbf9]">
      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
        <WifiOff className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-stone-800 mb-2">
        Ops! Tivemos uma falha de conexão
      </h2>
      <p className="text-stone-600 max-w-md text-sm mb-6 leading-relaxed">
        Não foi possível carregar as peças do catálogo no momento. Por favor, verifique sua conexão com a internet e tente novamente.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 active:scale-95 transition-all shadow"
      >
        <RefreshCw className="w-4 h-4" />
        Tentar novamente
      </button>
    </div>
  );
}
