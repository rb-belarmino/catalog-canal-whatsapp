# Implementation Plan: Catálogo de Roupas com Canal WhatsApp

**Branch**: `001-catalogo-whatsapp` | **Date**: 2026-09-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-catalogo-whatsapp/spec.md` and user tech stack parameters: Next.js 16.3.5 (App Router), Tailwind CSS, UploadThing, Neon (PostgreSQL), Prisma ORM 7, Simple Admin Password auth via environment variable, Playwright for E2E tests.

---

## Summary

Build a mobile-first online clothing catalog where a shopkeeper manages products (photo, name, price, order) and store settings via an admin dashboard, while customers browse the catalog, curate items into a client-side Wishlist, and seamlessly transfer their selected pieces to the shopkeeper's WhatsApp with a pre-formatted, polite Portuguese message including direct image URLs and calculated total.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js v24 (v20+ LTS compatible)  
**Primary Dependencies**: Next.js 16.3.5 (App Router, React 19, Server Components & Server Actions), Tailwind CSS v4, UploadThing (`uploadthing`, `@uploadthing/react`), `@dnd-kit/core` & `@dnd-kit/sortable` (for admin drag-and-drop reordering), Lucide React (icons)  
**Storage**: Neon Serverless PostgreSQL with Prisma ORM 7 (`@prisma/client`, `prisma`), client-side `localStorage` for customer wishlist  
**Testing**: Playwright (`@playwright/test`) for end-to-end tests across Desktop and Mobile viewports (iPhone SE 375px)  
**Target Platform**: Web (Responsive: Mobile-first iOS/Android + Desktop browsers)  
**Project Type**: Next.js Modular Monolith Web Application  
**Performance Goals**: Public catalog LCP < 2.5s on 4G mobile; sub-100ms client interactions for wishlist; zero layout shifts during image loading via skeleton screens  
**Constraints**: Operable on screens down to 375px width without horizontal scroll; strictly zero secrets in code or git; single admin password session permanent until explicit logout  
**Scale/Scope**: Single-tenant shop catalog (~50-500 products), high mobile traffic via direct WhatsApp referral links  

---

## Constitution Check

*GATE: Evaluated before Phase 0 research and verified post Phase 1 design.*

| Principle | Requirement / Standard | Plan Alignment | Status |
|-----------|------------------------|----------------|:------:|
| **I. Clean Code** | Single responsibility, descriptive naming, functions ≤ 40 lines (≤ 20 preferred). | Pure helper functions for currency, validation, and URL builders; clear modular file boundaries. | **PASS** |
| **II. Modular Monolith** | Single deployable unit; cohesive modules (`catalog`, `wishlist`, `admin`, `shared`). | App router routes delegate to module domains without circular dependencies. | **PASS** |
| **III. Excellent UX** | Fast, forgiving, human error messages, mobile-first (375px), skeleton loaders, direct WhatsApp redirect. | Mobile-first Tailwind design, pulse skeletons, empty states, zero zoom needed on mobile. | **PASS** |
| **IV. Security by Design** | Zero secrets in source code, `.env` in `.gitignore`, `.env.example` with placeholders, timing-safe auth comparison. | `ADMIN_PASSWORD` & `DATABASE_URL` strictly in `.env`; timing-safe password comparison; secure httpOnly cookie. | **PASS** |
| **V. Test-Driven Quality** | Critical user journeys covered by automated tests. | Comprehensive Playwright test suite for Catalog, Wishlist, Admin CRUD, Reordering, and WhatsApp redirect. | **PASS** |
| **VI. Observability** | Structured JSON logging for business and administrative events. | Centralized JSON logger in `src/shared/logger.ts` for logins, mutations, and config changes. | **PASS** |
| **VII. Simplicity & YAGNI** | Simplest solution satisfying requirements, no speculative generalization. | Minimalist stack; single admin password; no external auth service overhead; client-side wishlist. | **PASS** |

*Result: All gates PASS. No constitutional violations.*

---

## Project Structure

### Documentation (this feature)

```text
specs/001-catalogo-whatsapp/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0 research & technology choices
├── data-model.md        # Phase 1 data entities and schema
├── quickstart.md        # Phase 1 validation and run guide
└── contracts/           # Phase 1 interface contracts
    ├── admin-actions.md
    ├── public-catalog.md
    ├── uploadthing.md
    └── whatsapp-redirect.md
```

### Source Code (repository root)

```text
prisma/
└── schema.prisma                           # Neon PostgreSQL models (Product, ShopConfig)

src/
├── app/
│   ├── layout.tsx                          # Root layout (Tailwind, Fonts, WishlistProvider)
│   ├── page.tsx                            # Public Catalog Server Component
│   ├── error.tsx                           # Friendly error boundary (offline / connection retry screen)
│   ├── globals.css                         # Tailwind CSS imports & theme
│   ├── api/
│   │   └── uploadthing/
│   │       └── route.ts                    # UploadThing file router handler
│   └── admin/
│       ├── layout.tsx                      # Admin layout with auth verification
│       ├── page.tsx                        # Admin dashboard (Product table, DnD sort, Settings)
│       └── login/
│           └── page.tsx                    # Simple admin password login page
├── modules/
│   ├── catalog/
│   │   ├── components/
│   │   │   ├── product-card.tsx            # Single product card with image & wishlist trigger
│   │   │   ├── product-grid.tsx            # Responsive grid (1 col mobile, 2-3 col tablet/desktop)
│   │   │   └── skeleton-grid.tsx           # Placeholder skeleton cards
│   │   └── queries.ts                      # Server-side Prisma data queries
│   ├── wishlist/
│   │   ├── components/
│   │   │   ├── wishlist-floating-button.tsx# Sticky/header button with badge count
│   │   │   ├── wishlist-drawer.tsx         # Slide-over or modal with selected items & total
│   │   │   └── wishlist-item-row.tsx       # Mini card with photo, name, price, remove button
│   │   ├── context.tsx                     # React Context + localStorage hook
│   │   └── whatsapp.ts                     # URL & message generator
│   └── admin/
│       ├── components/
│       │   ├── product-form-modal.tsx      # Create/Edit product modal with UploadThing dropzone
│       │   ├── sortable-product-list.tsx   # @dnd-kit sortable table/grid
│       │   ├── sortable-product-item.tsx   # Draggable item row
│       │   ├── store-settings-form.tsx     # WhatsApp number & store name editor
│       │   └── login-form.tsx              # Password input form
│       ├── actions.ts                      # Server Actions (login, logout, CRUD, reorder, settings)
│       └── auth.ts                         # Token HMAC signing, verification & cookie management
├── shared/
│   ├── db.ts                               # Prisma Client global singleton
│   ├── logger.ts                           # Structured JSON logger
│   ├── utils.ts                            # Currency formatting (BRL), cn clsx merge
│   └── uploadthing.ts                      # UploadThing client helpers
tests/
└── e2e/
    ├── catalog.spec.ts                     # Public catalog layout & empty state tests
    ├── wishlist.spec.ts                    # Wishlist add/dedup/remove & WhatsApp redirect assertion
    └── admin.spec.ts                       # Admin auth, CRUD, reorder & config tests
playwright.config.ts                        # Playwright configuration (desktop + mobile 375px)
.env.example                                # Documented environment variable template
```

**Structure Decision**: Next.js App Router modular monolith. Frontend pages and backend server actions reside in the same project, organized into decoupled domain modules (`catalog`, `wishlist`, `admin`, `shared`), strictly adhering to Constitution Principle II.

---

## Complexity Tracking

> **No Constitution violations detected.** All components adhere strictly to Clean Code, Modular Monolith, Zero Secrets, and Simplicity (YAGNI).
