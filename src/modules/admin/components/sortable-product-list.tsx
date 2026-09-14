'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { Plus, Loader2, Sparkles } from 'lucide-react'
import { SortableProductItem } from './sortable-product-item'
import { ProductFormModal, type EditableProduct } from './product-form-modal'
import { reorderProductsAction, deleteProductAction } from '../actions'

interface SortableProductListProps {
  initialProducts: EditableProduct[]
}

export function SortableProductList({
  initialProducts
}: SortableProductListProps) {
  const [items, setItems] = useState<EditableProduct[]>(initialProducts)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(
    null
  )

  useEffect(() => {
    setItems(initialProducts)
  }, [initialProducts])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)

      const reordered = arrayMove(items, oldIndex, newIndex)
      setItems(reordered)

      // Persist to database
      setIsSavingOrder(true)
      try {
        const orderedIds = reordered.map(i => i.id)
        await reorderProductsAction(orderedIds)
      } catch (err) {
        console.error('Error saving new order:', err)
      } finally {
        setIsSavingOrder(false)
      }
    }
  }

  function handleOpenCreate() {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  function handleOpenEdit(product: EditableProduct) {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Deseja realmente remover a peça "${name}" do catálogo? Esta ação não pode ser desfeita.`
    )
    if (!confirmed) return

    setItems(prev => prev.filter(item => item.id !== id))
    await deleteProductAction(id)
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            Painel de Produtos
            <span className="text-xs font-medium px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
              {items.length} {items.length === 1 ? 'peça' : 'peças'}
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Arraste os itens para definir a ordem exata de exibição no catálogo
            público.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSavingOrder && (
            <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100 px-2.5 py-1.5 rounded-lg">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
              Salvando ordem...
            </span>
          )}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-sm font-medium rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Peça
          </button>
        </div>
      </div>

      {/* Product List */}
      {items.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-stone-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">
            Nenhuma peça cadastrada ainda
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Clique no botão &quot;Nova Peça&quot; acima para adicionar a
            primeira roupa com foto, nome e preço.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Primeira Peça
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {items.map(product => (
                <SortableProductItem
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal for create / edit */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
        onSaved={() => {
          // Revalidation triggers SSR refresh
        }}
      />
    </div>
  )
}
