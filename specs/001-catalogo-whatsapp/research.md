# Phase 0: Research & Technical Decisions

**Feature**: `001-catalogo-whatsapp` — Catálogo de Roupas com Canal WhatsApp  
**Date**: 2026-09-12  
**Status**: Completed  

---

## 1. Web Framework & Architecture

- **Decision**: Next.js 16.3.5 with App Router (`src/app`), Server Components (RSC) for initial page renders and Server Actions for data mutations.
- **Rationale**: 
  - Fulfills the explicit user requirement (`Next.js 16.3.5 (App Router)`).
  - Aligns with Constitution Principle II (Modular Monolith): frontend and backend live within the same deployable unit without cross-boundary network latency for internal queries.
  - Server Components allow the public catalog page (`/`) to fetch products directly via Prisma on the server, streaming HTML with instant LCP and zero client-side fetch waterfalls.
  - Server Actions handle admin mutations (create/edit/delete/reorder products, update settings, login/logout) with built-in CSRF protection, typesafety, and standard revalidation (`revalidatePath('/')`).
- **Alternatives considered**:
  - *Separate Express/Fastify backend + Next.js frontend*: Rejected. Violates Constitution Principle VII (Simplicity & YAGNI) and Principle II (Modular Monolith); adds unnecessary operational overhead and deployment complexity.
  - *Next.js Pages Router*: Rejected. App Router is the standard in modern Next.js with superior streaming, layout nesting, and native Server Actions.

---

## 2. Database & Data Access

- **Decision**: Neon Serverless PostgreSQL with Prisma ORM 7 (`@prisma/client` + `prisma`).
- **Rationale**:
  - Directly matches the user requirement (`Neon (PostgreSQL)`, `Prisma ORM 7`).
  - Neon provides serverless PostgreSQL with connection pooling via pooled connection string (`DATABASE_URL` ending with `-pooler`), perfect for serverless and Node.js environments.
  - Prisma ORM 7 provides strong TypeScript typing, schema migrations (`prisma migrate`), declarative models, and clean data access layers satisfying Constitution Principle I (Clean Code).
  - Prisma client will be instantiated as a singleton (`src/shared/db.ts`) attached to `globalThis` in development to prevent exhausting database connections during Fast Refresh.
- **Alternatives considered**:
  - *Drizzle ORM*: Fast and lightweight, but user explicitly specified Prisma ORM 7.
  - *Raw SQL (pg/postgres.js)*: Lacks declarative schema migration management and type generation, increasing risk of schema drift.

---

## 3. Styling & Responsive UI Design

- **Decision**: Tailwind CSS v4 with mobile-first styling, standardizing responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`) with base design targeting 375px width (iPhone SE).
- **Rationale**:
  - Matches the user specification (`Tailwind CSS`).
  - Fulfills Success Criterion SC-005 (operable on 375px screens without horizontal scroll) and Constitution Principle III (Excellent UX).
  - Tailwind provides utility classes for skeleton loading screens (`animate-pulse bg-zinc-200 dark:bg-zinc-800`), accessible focus states, and quick layout adjustments.
- **Alternatives considered**:
  - *CSS Modules / Styled Components*: More boilerplate, slower iteration, harder to keep consistent utility tokens.

---

## 4. Media Storage & Image Uploads

- **Decision**: UploadThing (`uploadthing` & `@uploadthing/react`) with an App Router route handler at `src/app/api/uploadthing/route.ts`.
- **Rationale**:
  - Matches user requirement (`UploadThing`).
  - UploadThing provides direct-to-storage client uploads with secure signed URLs, eliminating server bandwidth bottlenecks.
  - File router (`imageUploader`) configured with strict mime type (`image/*`), maximum size of 8MB (satisfying edge case for large file handling with client-side pre-validation), and admin session verification middleware.
  - Stores the permanent public CDN URL in the Prisma `Product.imageUrl` field.
- **Alternatives considered**:
  - *AWS S3 / Cloudflare R2 with custom presigned URLs*: Requires significant manual boilerplate for presigned URL generation, multipart uploads, and credential management. UploadThing simplifies this to a single declarative router.
  - *Local filesystem storage*: Incompatible with serverless hosting platforms (e.g. Vercel, Railway ephemeral containers).

---

## 5. Admin Authentication & Session Management

- **Decision**: Single-tenant admin authentication using environment variable password (`ADMIN_PASSWORD`), verified via Server Action, issuing an `httpOnly`, `Secure`, `SameSite=Lax` session cookie containing a cryptographically signed payload (`HMAC-SHA256` with `ADMIN_SESSION_SECRET`). Cookie expiration set to 10 years (`Max-Age=315360000`) to guarantee permanent session until explicit logout.
- **Rationale**:
  - Fulfills user requirement: "Auth admin Senha simples via variável de ambiente".
  - Fulfills Spec Clarification (Session 2026-09-12): "Sessão permanente — a vendedora permanece logada indefinidamente até clicar explicitamente em 'Sair'".
  - Fulfills Constitution Principle IV (Security by Design — Zero Secrets in Code): Password and secret are read strictly from `process.env.ADMIN_PASSWORD` and `process.env.ADMIN_SESSION_SECRET`.
  - Storing a signed token in an `httpOnly` cookie protects against XSS credential theft, while timing-safe comparison (`crypto.timingSafeEqual`) prevents timing attacks on password verification.
- **Alternatives considered**:
  - *NextAuth.js / Auth.js*: Unnecessary complexity for a single static admin password with permanent session; violates Principle VII (YAGNI).
  - *Plain text cookie (`admin=true`)*: Insecure; easily forged by any client without knowing the secret password.

---

## 6. Client-side Wishlist (Lista de Desejos)

- **Decision**: Client-side state managed via React Context / Custom Hook (`useWishlist`) backed by `window.localStorage` with key `catalog_wishlist_items`.
- **Rationale**:
  - Fulfills Spec FR-012 and SC-006: Wishlist persists across browser reloads without requiring customer authentication or database storage.
  - Avoids Next.js SSR hydration mismatches by initializing state after mount (`useEffect` or `useSyncExternalStore`).
  - Enforces single-item uniqueness (no duplicates, no quantity multiplier) as clarified in the spec ("Sem quantidade — cada peça aparece uma única vez; tentar adicionar novamente é ignorado silenciosamente").
  - Calculates total price dynamically using integer cents or standard float currency formatting in BRL (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`).
- **Alternatives considered**:
  - *Storing wishlist in Postgres via anonymous session cookies*: Unnecessary database bloat and cookie size overhead for a simple transient shopping list.

---

## 7. WhatsApp Message Formatting & Redirection

- **Decision**: Deterministic URL generator utility (`src/modules/wishlist/whatsapp-formatter.ts`) using standard `https://wa.me/{phone}?text={encodedText}` with device-aware link handling.
- **Rationale**:
  - Spec FR-015, FR-016, FR-017, and Clarification: Message must include greeting, formatted item lines (Product Name, Price in BRL, and direct image URL for each item), and total accumulated value.
  - Phone number fetched from `ShopConfig.whatsappNumber` in database; sanitized to digits only (E.164 without plus, e.g. `5511999999999`).
  - Safe URI encoding using `encodeURIComponent`.
  - Edge case truncation guard: If the total message exceeds WhatsApp URL limits (~2,000 characters), truncate gracefully with an ellipsis and display the total summary.
- **Alternatives considered**:
  - *WhatsApp Business Cloud API*: Unnecessary for this workflow; the user explicitly wants the client to be redirected directly to WhatsApp with the message ready to send.

---

## 8. Admin Drag-and-Drop Reordering

- **Decision**: `@dnd-kit/core` and `@dnd-kit/sortable` (with pointer and keyboard sensors) for the admin product list, persisting new indices to `Product.sortOrder` via a batch Server Action (`reorderProductsAction`).
- **Rationale**:
  - Fulfills Spec FR-026 and Clarification: "Reordenação manual — a vendedora pode arrastar e soltar as peças no admin para definir a ordem de exibição no catálogo público".
  - `@dnd-kit` is accessible, modern, lightweight, touch-friendly on mobile devices, and well-maintained in the React ecosystem.
  - The public catalog fetches products ordered by `sortOrder ASC`.
- **Alternatives considered**:
  - *HTML5 native drag & drop API*: Poor mobile/touch support and accessibility.
  - *Framer Motion*: Heavy bundle size overhead solely for list reordering.

---

## 9. End-to-End Testing Strategy

- **Decision**: Playwright (`@playwright/test`) configured with two primary device profiles: Desktop Chrome and Mobile Chrome / Mobile Safari (simulating iPhone SE 375x667 viewport).
- **Rationale**:
  - Fulfills user requirement (`Playwright para testes E2E`) and Constitution Principle V (Test-Driven Quality).
  - Playwright enables testing full end-to-end flows:
    1. Admin Login & Session Persistence.
    2. Admin Product Creation, Image Upload mock, Price editing, Deletion, and Reordering.
    3. Admin WhatsApp number configuration.
    4. Public Catalog browsing (verifying skeleton states, empty states, product cards, responsiveness at 375px).
    5. Wishlist add, duplicate prevention, remove, and total calculation.
    6. "Enviar para a vendedora" WhatsApp URL verification (intercepting window navigation and validating the encoded payload).
- **Alternatives considered**:
  - *Cypress*: Slower, heavier configuration for mobile viewport testing, user explicitly requested Playwright.

---

## 10. Structured Logging & Observability

- **Decision**: Lightweight structured logger in `src/shared/logger.ts` outputting JSON lines with timestamp, level (`info`, `warn`, `error`), correlation ID, module name, and metadata.
- **Rationale**:
  - Mandated by Constitution Principle VI (Observability & Structured Logging).
  - Logs admin actions (login attempts, product mutations, settings updates) and client events without logging sensitive data (no passwords, no raw customer phone numbers).
- **Alternatives considered**:
  - *Heavy APM agents (Datadog, New Relic)*: Overkill for initial launch; simple structured logger to stdout is portable to Vercel/Railway/Docker.
