import { Suspense } from "react";
import { Sparkles, ShoppingBag } from "lucide-react";
import { getCatalogProducts, getShopConfig } from "@/modules/catalog/queries";
import { ProductGrid } from "@/modules/catalog/components/product-grid";
import { SkeletonGrid } from "@/modules/catalog/components/skeleton-grid";
import { WishlistDrawer } from "@/modules/wishlist/components/wishlist-drawer";
import { WishlistFloatingButton } from "@/modules/wishlist/components/wishlist-floating-button";

export const dynamic = "force-dynamic";

async function CatalogSection() {
  const products = await getCatalogProducts();
  return <ProductGrid products={products} />;
}

export default async function HomePage() {
  const config = await getShopConfig();

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
      {/* Public Catalog Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-none">
                {config.storeName}
              </h1>
              <span className="text-[11px] text-stone-500 hidden sm:inline">
                Coleção Exclusiva
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Catálogo Oficial
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {config.dbError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs sm:text-sm">
            <p className="font-semibold mb-1">Aviso de Configuração (Banco de Dados):</p>
            <p className="text-amber-800">
              O banco de dados PostgreSQL ainda não foi alcançado em <code className="bg-amber-100 px-1 py-0.5 rounded">DATABASE_URL</code>.
              Insira a string de conexão do seu banco <strong>Neon</strong> no arquivo <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> e execute <code className="bg-amber-100 px-1 py-0.5 rounded">npx prisma db push</code> para sincronizar as tabelas.
            </p>
          </div>
        )}

        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
            Nossas Peças
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-xl">
            Selecione suas roupas favoritas para adicionar à sua Lista de Desejos e envie diretamente para o nosso WhatsApp!
          </p>
        </div>

        {/* Streaming Catalog Grid */}
        <Suspense fallback={<SkeletonGrid />}>
          <CatalogSection />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-white py-6 text-center text-xs text-stone-400">
        <p>© {new Date().getFullYear()} {config.storeName}. Todos os direitos reservados.</p>
      </footer>

      {/* Client-Side Wishlist Overlays */}
      <WishlistFloatingButton />
      <WishlistDrawer
        whatsappNumber={config.whatsappNumber}
        storeName={config.storeName}
      />
    </div>
  );
}
