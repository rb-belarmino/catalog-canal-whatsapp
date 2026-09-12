import { Sparkles } from "lucide-react";
import { ProductCard } from "./product-card";
import type { CatalogProduct } from "../queries";

interface ProductGridProps {
  products: CatalogProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 px-4 text-center bg-white border border-dashed border-stone-200 rounded-3xl max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-base font-semibold text-stone-800 mb-1.5">
          Catálogo em preparação
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
          Nosso catálogo está sendo preparado com muito carinho pela nossa equipe. Novas peças exclusivas estarão disponíveis em breve!
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
