import { Suspense } from 'react'
import { getCatalogProducts, getShopConfig } from '@/modules/catalog/queries'
import { CanalHeader } from '@/modules/catalog/components/canal-header'
import { ProductGrid } from '@/modules/catalog/components/product-grid'
import { SkeletonGrid } from '@/modules/catalog/components/skeleton-grid'
import { SearchProvider } from '@/modules/catalog/search-context'
import { WishlistDrawer } from '@/modules/wishlist/components/wishlist-drawer'
import { WishlistFloatingButton } from '@/modules/wishlist/components/wishlist-floating-button'

export const revalidate = 60

async function CatalogSection() {
  const products = await getCatalogProducts()
  return <ProductGrid products={products} />
}

export default async function HomePage() {
  const config = await getShopConfig()

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col bg-canal-bg">
        {/* Minimalist Sticky Header */}
        <CanalHeader />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {config.dbError && (
            <details className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xs">
              <summary className="font-semibold cursor-pointer select-none">
                ℹ️ Modo Demonstração (Catálogo estático ativo - Banco de dados offline)
              </summary>
              <p className="text-amber-800 text-xs mt-2">
                O banco de dados PostgreSQL ainda não foi alcançado em{' '}
                <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200">
                  DATABASE_URL
                </code>
                . O catálogo está rodando com todos os 41 looks e dados completos locais.
              </p>
            </details>
          )}

          {/* Section Heading with Editorial Canal Concept Typography */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="inline-block bg-taupe-300 text-black px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-[4px] uppercase">
              Coleção Verão 2027
            </h1>
            <p className="text-neutral-500 text-[11px] sm:text-xs tracking-[1px] uppercase mt-2 max-w-2xl mx-auto leading-relaxed">
              Selecione os modelos do seu interesse, para que a consultora verifique a disponibilidade de cores e tamanhos
            </p>
          </div>

          {/* Streaming Catalog Grid */}
          <Suspense fallback={<SkeletonGrid />}>
            <CatalogSection />
          </Suspense>
        </main>

        {/* Minimalist Footer */}
        <footer className="border-t border-canal-border bg-white py-8 text-center text-xs text-neutral-500 tracking-[1.5px] uppercase">
          <p>
            © {new Date().getFullYear()} Canal Concept. Todos os direitos
            reservados.
          </p>
        </footer>

        {/* Wishlist Drawer and Floating Button */}
        <WishlistFloatingButton />
        <WishlistDrawer
          whatsappNumber={config.whatsappNumber}
          storeName="Canal Concept"
        />
      </div>
    </SearchProvider>
  )
}
