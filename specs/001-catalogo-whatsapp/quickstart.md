# Quickstart Validation Guide: Catálogo de Roupas com Canal WhatsApp

**Feature**: `001-catalogo-whatsapp`  
**Date**: 2026-09-12  
**Status**: Ready  

This guide describes how to run and validate the application end-to-end, including local setup, database provisioning, Playwright test suite execution, and manual verification scenarios.

---

## 1. Prerequisites

- **Node.js**: `v20+` (current environment: `v24.18.0`)
- **Package Manager**: `npm`
- **Neon PostgreSQL**: A PostgreSQL connection string (`DATABASE_URL`) from [Neon Console](https://console.neon.tech) (or local Postgres container for offline dev).
- **UploadThing**: `UPLOADTHING_TOKEN` (or `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`) from [UploadThing Dashboard](https://uploadthing.com).

---

## 2. Environment Setup

Create `.env.local` (ensure it is listed in `.gitignore` as per Constitution Principle IV):

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Admin Authentication
ADMIN_PASSWORD="sua-senha-admin-aqui"
ADMIN_SESSION_SECRET="uma-chave-secreta-aleatoria-para-assinatura-com-32-caracteres"

# Media Storage (UploadThing)
UPLOADTHING_TOKEN="sua_uploadthing_token_aqui"
```

Initialize database schema with Prisma:

```bash
npx prisma db push
# or
npx prisma migrate dev --name init
```

---

## 3. Running the Development Server

```bash
npm run dev
```

The app will be available at:
- Public Catalog: `http://localhost:3000`
- Admin Login: `http://localhost:3000/admin/login`
- Admin Dashboard: `http://localhost:3000/admin`

---

## 4. Automated E2E Testing with Playwright

Run the complete test suite against local development:

```bash
# Install Playwright browser binaries (first time)
npx playwright install --with-deps chromium

# Run all E2E tests
npx playwright test

# Run tests in UI mode for visual inspection
npx playwright test --ui

# Run mobile viewport test specifically (iPhone SE 375px)
npx playwright test --project="Mobile Safari"
```

---

## 5. Manual End-to-End Validation Scenarios

### Scenario 1: Initial Empty State & Admin Configuration
1. Open `http://localhost:3000`.
2. **Expected**: Friendly empty state message ("Nosso catálogo está sendo preparado..."). No crash, clean 375px mobile responsive layout without horizontal scrolling.
3. Navigate to `http://localhost:3000/admin`.
4. **Expected**: Redirected to `/admin/login`.
5. Enter invalid password → **Expected**: Error message "Senha incorreta".
6. Enter valid `ADMIN_PASSWORD` → **Expected**: Redirected to dashboard `/admin`. Session persists on reload.
7. Fill store WhatsApp number (e.g. `5511999998888`) and click "Salvar Configurações".
8. **Expected**: Toast feedback showing configuration saved.

### Scenario 2: Product Creation & Image Upload
1. In the admin dashboard, click "Nova Peça".
2. Enter Name: `Vestido Floral Midi`, Price: `189,90`, and upload a sample photo.
3. Click "Salvar Produto".
4. **Expected**: Product is created with status active. Visible in admin table.
5. Add a second piece: `Blusa de Linho Bege`, Price: `120,00`.
6. Return to `http://localhost:3000`.
7. **Expected**: Both pieces displayed in the grid with photo, name, and formatted BRL price.

### Scenario 3: Admin Drag-and-Drop Reordering
1. In admin dashboard `/admin`, drag `Blusa de Linho Bege` to the top position ahead of `Vestido Floral Midi`.
2. Open `http://localhost:3000` in another browser tab.
3. **Expected**: Public catalog immediately shows `Blusa de Linho Bege` first, followed by `Vestido Floral Midi`.

### Scenario 4: Customer Wishlist & WhatsApp Redirection
1. On `http://localhost:3000`, click "Adicionar à Lista de Desejos" on `Blusa de Linho Bege`.
2. **Expected**: Counter badge updates to 1.
3. Click "Adicionar" again on the same product.
4. **Expected**: Counter remains 1 (silent deduplication as per spec clarification).
5. Click "Adicionar" on `Vestido Floral Midi`. Counter updates to 2.
6. Open the Wishlist drawer/modal.
7. **Expected**: Both items listed with individual prices and total `R$ 309,90`.
8. Click "Enviar para a vendedora".
9. **Expected**:
   - In desktop: opens WhatsApp Web with pre-formatted message containing both items, their image URLs, and the total R$ 309,90.
   - In mobile (or mobile emulation): triggers `wa.me/5511999998888` redirect.
