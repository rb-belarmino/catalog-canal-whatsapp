import type { Metadata } from 'next'
import Link from 'next/link'
import { getProductsByIds, getShopConfig } from '@/modules/catalog/queries'
import { CanalLogo } from '@/modules/catalog/components/canal-logo'
import { WishlistListViewer } from './wishlist-list-viewer'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Lista de Desejos | Catálogo By Jéssica Lindsey - Canal Concept',
  description:
    'Confira as peças selecionadas na lista de desejos da Canal Concept.'
}

interface WishlistPageProps {
  searchParams: Promise<{ ids?: string }>
}

export default async function WishlistPage({
  searchParams
}: WishlistPageProps) {
  const resolvedParams = await searchParams
  let idsString = resolvedParams?.ids || ''
  try {
    idsString = decodeURIComponent(idsString)
  } catch {}

  const ids = idsString
    .split(/[,;+\s]+/)
    .map(id => id.trim())
    .filter(Boolean)

  const [products, config] = await Promise.all([
    getProductsByIds(ids),
    getShopConfig()
  ])

  return (
    <div className="min-h-screen flex flex-col bg-canal-bg">
      {/* Minimalist Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-canal-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <CanalLogo />
          <Link
            href="/"
            className="text-[11px] uppercase tracking-canal-wide text-neutral-600 hover:text-black font-medium transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <span className="inline-block bg-[#D6D2CC] text-black px-4 py-1.5 text-xs font-semibold tracking-[3.5px] uppercase">
            Seleção da Cliente
          </span>
          <h1 className="text-xl sm:text-2xl font-normal uppercase tracking-canal-wide text-black mt-3">
            Lista de Desejos
          </h1>
          <p className="text-neutral-500 text-xs tracking-[1px] uppercase mt-1">
            Peças selecionadas para atendimento da Consultora Jéssica
          </p>
        </div>

        <WishlistListViewer
          initialProducts={products}
          whatsappNumber={config.whatsappNumber}
          storeName={config.storeName}
        />
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-canal-border bg-white py-8 text-center text-xs text-neutral-500 tracking-[1.5px] uppercase mt-auto">
        <p>
          © {new Date().getFullYear()} Canal Concept. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  )
}
