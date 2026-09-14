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
            <div className="mb-6 p-4 bg-white border border-amber-200 text-amber-900 text-xs sm:text-sm">
              <p className="font-semibold mb-1">
                Aviso de Configuração (Banco de Dados):
              </p>
              <p className="text-amber-800 text-xs">
                O banco de dados PostgreSQL ainda não foi alcançado em{' '}
                <code className="bg-neutral-100 px-1 py-0.5 rounded">
                  DATABASE_URL
                </code>
                . Insira a string de conexão no arquivo{' '}
                <code className="bg-neutral-100 px-1 py-0.5 rounded">.env</code>{' '}
                e execute{' '}
                <code className="bg-neutral-100 px-1 py-0.5 rounded">
                  npx prisma db push
                </code>
                .
              </p>
            </div>
          )}

          {/* Section Heading with Editorial Canal Concept Typography */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xs sm:text-sm font-semibold tracking-[4px] uppercase text-black">
              Coleção Oficial
            </h1>
            <p className="text-neutral-500 text-[11px] sm:text-xs tracking-[1px] uppercase mt-1">
              Monte sua seleção de favoritos para que a consultora oriente você
              e reserve suas peças no WhatsApp
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
