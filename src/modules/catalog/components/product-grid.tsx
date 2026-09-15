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

      {/* Responsive Editorial Product Grid: 1 col on mobile, multi-col on desktop */}
      <div
        data-testid="product-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-lg mx-auto sm:max-w-none"
      >
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
