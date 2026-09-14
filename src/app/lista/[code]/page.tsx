import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ImageOff } from 'lucide-react'
import { getProductsByIds } from '@/modules/catalog/queries'
import { getSharedWishlistProductIds } from '@/modules/wishlist/actions'
import { CanalLogo } from '@/modules/catalog/components/canal-logo'
import { formatCurrencyBRL } from '@/shared/utils'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Lista de Desejos da Cliente | Canal Concept',
  description:
    'Seleção exclusiva de peças para atendimento da Consultora Jéssica Lindsey.'
}

interface ShortWishlistPageProps {
  params: Promise<{ code: string }>
}

export default async function ShortWishlistPage({
  params
}: ShortWishlistPageProps) {
  const { code } = await params
  if (!code) {
    notFound()
  }

  const productIds = await getSharedWishlistProductIds(code)
  if (!productIds || productIds.length === 0) {
    notFound()
  }

  const products = await getProductsByIds(productIds)
  const totalCount = products.length

  return (
    <div className="min-h-screen flex flex-col bg-canal-bg">
      {/* Minimalist Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-canal-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <CanalLogo />
          <Link
            href="/"
            className="text-[11px] uppercase tracking-canal-wide text-neutral-600 hover:text-black font-medium transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title & Badge */}
        <div className="text-center mb-8 sm:mb-10">
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

        {/* Summary Card */}
        <div className="bg-white border border-canal-border p-4 sm:p-5 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-canal-wide text-neutral-400 font-medium">
              Resumo da Seleção
            </span>
            <p className="text-sm font-semibold uppercase tracking-[1.5px] text-black mt-0.5">
              {totalCount}{' '}
              {totalCount === 1 ? 'peça selecionada' : 'peças selecionadas'}
            </p>
          </div>
        </div>

        {/* Products List / Grid */}
        <div className="space-y-4">
          {products.map(product => {
            return (
              <div
                key={product.id}
                className="bg-white border border-canal-border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-black transition-colors"
              >
                {/* 3:4 Aspect Image */}
                <div className="relative w-28 sm:w-24 aspect-3/4 bg-canal-bg overflow-hidden shrink-0 border border-canal-border">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
                      <ImageOff className="w-5 h-5 mb-1 opacity-40" />
                      <span className="text-[9px] uppercase tracking-wider">
                        Sem foto
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-normal tracking-[0.5px] uppercase text-black leading-tight">
                    {product.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-base sm:text-lg font-bold text-black tracking-tight">
                      {formatCurrencyBRL(product.priceInCents)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-canal-wide transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explorar Coleção Completa</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-canal-border bg-white py-8 text-center text-xs text-neutral-500 tracking-[1.5px] uppercase mt-auto">
        <p>
          © {new Date().getFullYear()} Canal Concept. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  )
}
