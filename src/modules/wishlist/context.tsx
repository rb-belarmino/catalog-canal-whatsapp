'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react'

export interface WishlistItem {
  id: string
  name: string
  priceInCents: number
  imageUrl: string
  addedAt: number
}

interface WishlistContextType {
  items: WishlistItem[]
  totalInCents: number
  totalCount: number
  hasItem: (productId: string) => boolean
  addItem: (product: {
    id: string
    name: string
    priceInCents: number
    imageUrl: string
  }) => void
  removeItem: (productId: string) => void
  toggleItem: (product: {
    id: string
    name: string
    priceInCents: number
    imageUrl: string
  }) => void
  clearWishlist: () => void
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

const STORAGE_KEY = 'catalog_wishlist_items'

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage after mount (protect against SSR hydration mismatches)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (e) {
      console.warn('Failed to load wishlist from localStorage', e)
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever items change after initial mount
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e)
    }
  }, [items, mounted])

  const hasItem = useCallback(
    (productId: string) => items.some(item => item.id === productId),
    [items]
  )

  const addItem = useCallback(
    (product: {
      id: string
      name: string
      priceInCents: number
      imageUrl: string
    }) => {
      setItems(prev => {
        // Enforce single-item uniqueness (silent deduplication as per spec clarification)
        if (prev.some(item => item.id === product.id)) {
          return prev
        }
        return [...prev, { ...product, addedAt: Date.now() }]
      })
    },
    []
  )

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }, [])

  const toggleItem = useCallback(
    (product: {
      id: string
      name: string
      priceInCents: number
      imageUrl: string
    }) => {
      setItems(prev => {
        if (prev.some(item => item.id === product.id)) {
          return prev.filter(item => item.id !== product.id)
        }
        return [...prev, { ...product, addedAt: Date.now() }]
      })
    },
    []
  )

  const clearWishlist = useCallback(() => {
    setItems([])
  }, [])

  const totalInCents = useMemo(
    () => items.reduce((acc, curr) => acc + curr.priceInCents, 0),
    [items]
  )

  const totalCount = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalInCents,
        totalCount,
        hasItem,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
