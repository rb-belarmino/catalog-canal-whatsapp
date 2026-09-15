'use client'

import * as React from 'react'
import { Sparkles, SearchX } from 'lucide-react'
import { ProductCard } from './product-card'
import { useSearch } from '../search-context'
import { Button } from '@/shared/components/ui/button'
import type { CatalogProduct } from '../queries'

interface ProductGridProps {
  products: CatalogProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { searchQuery, setSearchQuery } = useSearch()
  const [mobileColumns, setMobileColumns] = React.useState<1 | 2>(1)

  // Filter products by search query across look title, piece names, colors, and composition
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return products
    const query = searchQuery.toLowerCase().trim()
    return products.filter(p => {
      if (p.name.toLowerCase().includes(query)) return true
      if (p.pieces && Array.isArray(p.pieces)) {
        return p.pieces.some(piece => {
          if (piece.name.toLowerCase().includes(query)) return true
          if (piece.composition && piece.composition.toLowerCase().includes(query)) return true
          if (piece.colors && piece.colors.some(c => c.toLowerCase().includes(query))) return true
          return false
        })
      }
      return false
    })
  }, [products, searchQuery])

  // Case 1: Catalog is genuinely empty (no products in store)
  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center bg-white border border-canal-border max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-neutral-100 text-black flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-xs font-semibold uppercase tracking-canal-wide text-black mb-2">
          Coleção em Preparação
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
          Novas peças exclusivas da coleção Canal Concept estarão disponíveis em
          breve.
        </p>
      </div>
    )
  }

  // Case 2: Search returned 0 results
  if (filteredProducts.length === 0) {
    return (
      <div className="py-16 px-4 text-center bg-white border border-canal-border max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-canal-wide text-black mb-2">
          Nenhuma Peça Encontrada
        </h3>
        <p className="text-xs text-neutral-500 mb-5">
          Não encontramos resultados para &quot;{searchQuery}&quot;. Tente outro
          termo ou explore a coleção completa.
        </p>
        <Button
          type="button"
          onClick={() => setSearchQuery('')}
          variant="outline"
          size="sm"
          className="text-xs tracking-[1.5px] uppercase"
        >
          Ver Todas as Peças
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Search Result Feedback Bar */}
      {searchQuery.trim() && (
        <div className="mb-6 flex items-center justify-between border-b border-canal-border pb-3">
          <p className="text-xs text-neutral-600 tracking-[1px] uppercase">
            Resultados para &quot;
            <span className="text-black font-semibold">{searchQuery}</span>
            &quot; ({filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'peça' : 'peças'})
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-neutral-500 hover:text-black uppercase tracking-[1px] underline cursor-pointer"
          >
            Limpar Busca
          </button>
        </div>
      )}

      {/* Mobile Grid Layout Selector */}
      <div className="flex sm:hidden items-center justify-between mb-4 pb-2.5 border-b border-canal-border">
        <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'Look disponível' : 'Looks disponíveis'}
        </span>
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 border border-canal-border">
          <button
            type="button"
            onClick={() => setMobileColumns(1)}
            aria-label="Visualização 1 coluna (detalhada)"
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] tracking-wider uppercase transition-all cursor-pointer ${
              mobileColumns === 1
                ? 'bg-black text-white font-semibold shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16">
              <rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="1"
                fill={mobileColumns === 1 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>1 por linha</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileColumns(2)}
            aria-label="Visualização 2 colunas (grade compacta)"
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] tracking-wider uppercase transition-all cursor-pointer ${
              mobileColumns === 2
                ? 'bg-black text-white font-semibold shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16">
              <rect
                x="2"
                y="2"
                width="5"
                height="12"
                rx="1"
                fill={mobileColumns === 2 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="9"
                y="2"
                width="5"
                height="12"
                rx="1"
                fill={mobileColumns === 2 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>2 por linha</span>
          </button>
        </div>
      </div>

      {/* Responsive Editorial Product Grid: 1 col on mobile by default, 2 cols when toggled, multi-col on desktop */}
      <div
        data-testid="product-grid"
        className={
          mobileColumns === 1
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-lg mx-auto sm:max-w-none'
            : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
        }
      >
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
