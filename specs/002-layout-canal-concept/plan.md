# Implementation Plan: Layout Moderno e Atualizado Inspirado na Canal Concept

**Branch**: `002-layout-canal-concept` | **Date**: 2026-09-13 | **Spec**: [spec.md](./spec.md)

**Input**: Layout moderno e atualizado referenciado conforme o site oficial da marca Canal (https://www.canal.com.br/), utilizando Tailwind CSS v4 e componentização no padrão shadcn/ui.

---

## Summary

O objetivo desta funcionalidade é transformar a interface e a experiência da vitrine digital em uma experiência de alta costura contemporânea, alinhada com a identidade visual da marca **Canal Concept** (https://www.canal.com.br/). A implementação utiliza **Tailwind CSS v4** e componentes modulares no padrão **shadcn/ui** (Button, Input, Badge, Sheet/Drawer), apresentando:
- Fundo claro neutro minimalista (`#F7F7F7`) e tipografia geométrica em caixa alta com espaçamento ampliado (`tracking`).
- Barra superior de avisos/benefícios institucionais (frete, parcelamento em até 10x, PIX e WhatsApp).
- Cabeçalho minimalista com logotipo oficial em vetor SVG da Canal Concept, busca rápida e sacola com contador.
- Grade contínua de produtos em proporção vertical editorial (3:4), sem categorias (vitrine única e direta).
- Adição à Sacola de Desejos com um clique (sem grade de tamanho no catálogo) e painel lateral deslizante (*Sheet*) com fechamento direto e formatado para o WhatsApp da vendedora.

---

## Technical Context

**Language/Version**: TypeScript 5.7+ / Node.js 20+

**Primary Dependencies**: Next.js 15.2 (App Router, Server Components & Suspense), React 19, Tailwind CSS v4, Lucide React, clsx, tailwind-merge (utilitário `cn`), Prisma 6.4

**Storage**: PostgreSQL (via Prisma ORM) com fallback resiliente e `localStorage` no client-side para a Sacola de Desejos.

**Testing**: Playwright (`tests/catalog-flow.spec.ts`, `tests/canal-layout.spec.ts`) para testes ponta a ponta (E2E).

**Target Platform**: Web responsiva (Mobile-first, smartphones a partir de 320px, tablets e desktops).

**Project Type**: Web application (Next.js modular monolith).

**Performance Goals**: First Contentful Paint < 1.0s, First Meaningful Paint / LCP < 1.8s em conexões móveis, zero Cumulative Layout Shift (CLS < 0.05).

**Constraints**: Paleta de cores neutra e elegante da Canal Concept (`#F7F7F7`, preto e branco), proporção de imagem vertical 3:4, sem bibliotecas pesadas de terceiros (zero runtime CSS-in-JS).

**Scale/Scope**: Vitrine com suporte a dezenas de peças ativas com busca instantânea local/URL e carregamento streaming.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio Constitucional | Avaliação no Plano | Status |
| :--- | :--- | :---: |
| **I. Clean Code (NON-NEGOTIABLE)** | Componentes pequenos (≤ 40 linhas preferencialmente), responsabilidade única, nomenclatura expressiva e clara. | ✅ PASS |
| **II. Modular Monolith Architecture** | Separação estrita em módulos (`catalog`, `wishlist`, `admin`, `shared`), sem acoplamento indevido ou importações circulares. | ✅ PASS |
| **III. Excellent User Experience** | Layout fluido, responsivo, sem cliques desnecessários (adição com um clique), feedback visual e estética editorial refinada. | ✅ PASS |
| **IV. Security by Design** | Credenciais exclusivamente em `.env`, sem segredos expostos no front-end ou versionamento. | ✅ PASS |
| **V. Test-Driven Quality** | Validação E2E com Playwright cobrindo visualização da vitrine Canal Concept, busca textual e fluxo WhatsApp. | ✅ PASS |
| **VI. Observability & Logging** | Logs estruturados via `logger.ts` para requisições e eventos do catálogo. | ✅ PASS |
| **VII. Simplicity & YAGNI** | Rejeição de taxonomias desnecessárias (sem categorias na vitrine), sem modais de tamanho desnecessários, apenas o essencial de alto impacto. | ✅ PASS |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-layout-canal-concept/
├── spec.md              # Especificação refinada com esclarecimentos
├── plan.md              # Este arquivo (Plano arquitetural de implementação)
├── research.md          # Decisões arquiteturais e referências do site Canal Concept
├── data-model.md        # Modelos de dados e entidades
├── quickstart.md        # Guia de execução e validação ponta a ponta
└── contracts/           # Contratos de interfaces e componentes
    ├── whatsapp-message.contract.ts
    └── ui-components.contract.ts
```

### Source Code Layout

```text
src/
├── app/
│   ├── globals.css                       # Estilos globais Tailwind v4 com paleta Canal Concept
│   ├── layout.tsx                        # Layout raiz com fontes e metadados Canal Concept
│   ├── page.tsx                          # Página pública com barra de topo, cabeçalho e vitrine
│   └── admin/                            # Painel administrativo
├── shared/
│   ├── components/ui/                    # Primitivas shadcn/ui
│   │   ├── button.tsx                    # Botão minimalista
│   │   ├── input.tsx                     # Campo de busca minimalista
│   │   ├── badge.tsx                     # Selos sutis
│   │   └── sheet.tsx                     # Painel deslizante (Drawer)
│   ├── utils.ts                          # Funções utilitárias (cn, formatCurrencyBRL)
│   ├── logger.ts                         # Logging estruturado
│   └── db.ts                             # Cliente Prisma
└── modules/
    ├── catalog/
    │   ├── components/
    │   │   ├── canal-header.tsx          # Cabeçalho com logo SVG Canal Concept e busca
    │   │   ├── top-announcement-bar.tsx  # Barra superior de benefícios e avisos
    │   │   ├── product-card.tsx          # Cartão com foto vertical 3:4, tipografia e preço
    │   │   ├── product-grid.tsx          # Grade responsiva de peças
    │   │   └── skeleton-grid.tsx         # Skeletons elegantes
    │   └── queries.ts                    # Busca e consultas do catálogo
    └── wishlist/
        ├── components/
        │   ├── wishlist-drawer.tsx       # Gaveta lateral minimalista da sacola
        │   ├── wishlist-floating-button.tsx # Botão flutuante ergonômico
        │   └── wishlist-item-row.tsx     # Linha de produto com foto e preço
        ├── context.tsx                   # Contexto de estado da sacola
        └── utils.ts                      # Gerador da mensagem formatada para WhatsApp
```

**Structure Decision**: Monolito modular Next.js organizado em módulos de domínio (`catalog`, `wishlist`, `admin`) e camada compartilhada de primitivas shadcn/ui (`shared/components/ui/`), garantindo reutilização e clareza arquitetural.

---

## Complexity Tracking

*Nenhuma violação aos princípios constitucionais. O escopo foi simplificado (sem categorias e sem grade de tamanhos na vitrine).*
