# Contract: Admin Server Actions

**Module**: `src/modules/admin/actions.ts`  
**Purpose**: Secure backend operations for the admin dashboard.

---

## 1. Authentication Actions

### `loginAdminAction(formData: FormData): Promise<ActionResult>`

- **Input**:
  - `formData.get('password')`: string (submitted admin password)
- **Validation**:
  - Requires non-empty string.
  - Constant-time comparison against `process.env.ADMIN_PASSWORD`.
- **Side Effects on Success**:
  - Sets HTTP-only cookie `admin_session` with signed token (`Max-Age=315360000`, `Path=/`, `HttpOnly`, `SameSite=Lax`, `Secure` in production).
  - Emits structured log event `ADMIN_LOGIN_SUCCESS`.
- **Response**:
  ```typescript
  type ActionResult<T = void> = 
    | { success: true; data?: T }
    | { success: false; error: string };
  ```
- **Error Cases**:
  - Invalid password: `{ success: false, error: "Senha incorreta. Tente novamente." }`

### `logoutAdminAction(): Promise<ActionResult>`

- **Input**: None.
- **Side Effects**:
  - Clears `admin_session` cookie (`Max-Age=0`).
  - Redirects to `/admin/login`.
- **Response**: `{ success: true }`

---

## 2. Product Management Actions

All product actions require a valid `admin_session` cookie; unauthenticated requests immediately throw/return `{ success: false, error: "Não autorizado" }`.

### `createProductAction(input: CreateProductInput): Promise<ActionResult<Product>>`

- **Input Schema**:
  ```typescript
  interface CreateProductInput {
    name: string;          // min 2, max 120
    priceInCents: number;  // > 0
    imageUrl: string;      // valid uploadthing URL
  }
  ```
- **Execution**:
  1. Verify admin session.
  2. Compute next `sortOrder`: `(await prisma.product.aggregate({ _max: { sortOrder: true } }))._max.sortOrder + 1` (or 0 if empty).
  3. Insert `Product` record into Neon PostgreSQL.
  4. Call `revalidatePath('/')` and `revalidatePath('/admin')`.
  5. Log `PRODUCT_CREATED` with product ID.
- **Response**: `{ success: true, data: Product }`

### `updateProductAction(input: UpdateProductInput): Promise<ActionResult<Product>>`

- **Input Schema**:
  ```typescript
  interface UpdateProductInput {
    id: string;
    name?: string;
    priceInCents?: number;
    imageUrl?: string;
    active?: boolean;
  }
  ```
- **Execution**:
  1. Verify admin session.
  2. Update product in DB.
  3. Call `revalidatePath('/')` and `revalidatePath('/admin')`.
- **Response**: `{ success: true, data: Product }`

### `deleteProductAction(id: string): Promise<ActionResult>`

- **Input**: Product ID string.
- **Execution**:
  1. Verify admin session.
  2. Delete product record from DB.
  3. Optionally invoke UploadThing delete file API for associated image.
  4. Call `revalidatePath('/')` and `revalidatePath('/admin')`.
- **Response**: `{ success: true }`

### `reorderProductsAction(orderedIds: string[]): Promise<ActionResult>`

- **Input**: Array of product IDs in their new desired order.
- **Execution**:
  1. Verify admin session.
  2. Run batch transaction updating each product's `sortOrder` to match its array index (`0, 1, 2, ...`).
  3. Call `revalidatePath('/')` and `revalidatePath('/admin')`.
  4. Log `PRODUCTS_REORDERED` count.
- **Response**: `{ success: true }`

---

## 3. Store Configuration Actions

### `updateShopConfigAction(input: UpdateShopConfigInput): Promise<ActionResult<ShopConfig>>`

- **Input Schema**:
  ```typescript
  interface UpdateShopConfigInput {
    storeName?: string;
    whatsappNumber?: string; // Digits only, international format (e.g. 5511999999999)
  }
  ```
- **Execution**:
  1. Verify admin session.
  2. Sanitize and validate phone format.
  3. Upsert `ShopConfig` with ID `"default"`.
  4. Call `revalidatePath('/')` and `revalidatePath('/admin')`.
- **Response**: `{ success: true, data: ShopConfig }`
