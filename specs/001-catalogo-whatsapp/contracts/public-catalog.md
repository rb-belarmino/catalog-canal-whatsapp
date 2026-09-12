# Contract: Public Catalog & Wishlist Interface

**Module**: `src/modules/catalog/queries.ts` and `src/modules/wishlist/context.tsx`  
**Purpose**: Public data access and client wishlist state management.

---

## 1. Server-Side Data Access (Server Components)

### `getCatalogProducts(): Promise<CatalogProduct[]>`

- **Scope**: Executed on server inside `src/app/page.tsx`.
- **Query**:
  ```typescript
  await prisma.product.findMany({
    where: { active: true },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    select: {
      id: true,
      name: true,
      priceInCents: true,
      imageUrl: true,
    }
  });
  ```
- **Return Type**:
  ```typescript
  interface CatalogProduct {
    id: string;
    name: string;
    priceInCents: number;
    imageUrl: string;
  }
  ```
- **Error/Empty Behavior**:
  - If database returns `[]`, public page renders friendly empty catalog notice: `"Nosso catálogo está sendo preparado com muito carinho. Volte em breve!"` (FR-006).

### `getShopConfig(): Promise<PublicShopConfig>`

- **Query**:
  ```typescript
  await prisma.shopConfig.findUnique({
    where: { id: 'default' }
  });
  ```
- **Return Type**:
  ```typescript
  interface PublicShopConfig {
    storeName: string;
    whatsappNumber: string;
  }
  ```

---

## 2. Client-Side Wishlist Contract (`useWishlist`)

- **Hook Signature**:
  ```typescript
  interface WishlistContextType {
    items: WishlistItem[];
    totalInCents: number;
    totalCount: number;
    hasItem: (productId: string) => boolean;
    addItem: (product: CatalogProduct) => void;
    removeItem: (productId: string) => void;
    clearWishlist: () => void;
  }
  ```

### Behaviors
1. **`addItem(product)`**:
   - Checks if `items.some(i => i.id === product.id)`.
   - If already present: does NOT increment count or duplicate. Silently succeeds.
   - If not present: appends `{ ...product, addedAt: Date.now() }` to list.
   - Saves to `localStorage['catalog_wishlist_items']`.
   - Triggers subtle UI feedback (e.g. badge count pulse, toast notification).
2. **`removeItem(productId)`**:
   - Filters out matching product.
   - Saves updated array to `localStorage`.
   - Recalculates `totalInCents`.
3. **Hydration Protection**:
   - `items` defaults to `[]` during SSR; populates from `localStorage` immediately after client mount to prevent React hydration warning #418/425.
