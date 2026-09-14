# Technical Research: Layout Moderno Inspirado na Canal Concept

**Feature Branch**: `002-layout-canal-concept`
**Date**: 2026-09-13
**Scope**: Estudo arquitetural e decisões tecnológicas para a vitrine inspirada na Canal Concept com Tailwind CSS e shadcn/ui.

---

## 1. Design System & Componentização (Tailwind v4 + shadcn/ui)

### Decisão

Utilizar o **Tailwind CSS v4** integrado com componentes no padrão **shadcn/ui** (adotando utilitários `cn` com `clsx` e `tailwind-merge` já presentes em `src/shared/utils.ts`).
Criar componentes modulares e acessíveis:

- `Button` (variantes: `default` preto sólido minimalista, `outline`, `ghost`, `link`)
- `Input` (campo de busca minimalista com fundo transparente ou off-white, sem bordas pesadas, estilo Canal)
- `Badge` (etiquetas de desconto ou novidade em caixa alta com tracking)
- `Drawer` / `Sheet` (painel deslizante ergonômico para a Sacola de Desejos)

### Raciocínio (Rationale)

- Atende diretamente à diretriz do usuário: _"ira utilizar Tailwind, componetizacao shadcn-ui"_.
- O padrão shadcn/ui permite posse total do código do componente, sem bibliotecas pesadas de terceiros que possam conflitar com o React 19.
- Totalmente alinhado ao princípio **Clean Code** e **Simplicity & YAGNI** da Constituição do projeto.

### Alternativas Consideradas

- **Bibliotecas monolíticas (MUI, Mantine, Ant Design)**: Rejeitadas por introduzir dependências pesadas de runtime, overhead de CSS-in-JS e incompatibilidades com React 19 e Server Components.
- **Componentes Tailwind puramente inline sem abstração**: Rejeitados por violar a padronização e dificultar a manutenção consistente da UI em múltiplos módulos.

---

## 2. Identidade Visual Canal Concept (Tipografia, Paleta e Proporções)

### Decisão

Reproduzir a estética contemporânea e minimalista da **Canal Concept** (baseada na análise do site `https://www.canal.com.br/`):

- **Paleta de Cores**:
  - Fundo principal: `#F7F7F7` (off-white neutro característico da Canal).
  - Superfícies/Cartões: `#FFFFFF`.
  - Tipografia e contrastes: `#000000` e `#1A1A1A` (preto puro e carvão para elegância).
  - Linhas e divisores: `#E2E2E2` e `#EEEEEE` (bordas ultra-finas e discretas).
  - Destaque sutil: `#FF005C` ou badge preto para indicativos de desconto / contador de sacola.
- **Tipografia**:
  - Estilo sem serifa geométrico com caixa alta e espaçamento ampliado (`uppercase`, `tracking-canal-wide` a `tracking-[2.8px]`).
- **Proporção Fotográfica**:
  - Aspect ratio vertical 3:4 ou 2:3 nos cartões de peças (estética de editorial de moda).
- **Logotipo e Cabeçalho**:
  - Marca oficial "CANAL CONCEPT" em vetor SVG fiel ao site oficial.
  - Barra superior de comunicados rotativos/fixos em caixa alta.

### Raciocínio

- Transmite autoridade, sofisticação de alta costura e fidelidade imediata à marca Canal Concept para a cliente final.

---

## 3. Navegação da Vitrine e Mecanismo de Busca

### Decisão

Manter uma **vitrine contínua unificada sem abas de categorias** (em estrita concordância com a Decisão de Esclarecimento nº 2 do usuário: _"nao tera categorias"_).
A navegação conta com:

- Campo de busca instantânea no cabeçalho (com debounce de ~200ms para digitação fluida).
- Grade responsiva: 2 colunas no mobile (maximizando o aproveitamento vertical das telas de smartphone) e 3 a 4 colunas em desktops.
- Estado vazio refinado com sugestão de reset de busca.

### Raciocínio

- Foco absoluto na usabilidade ágil e sem fricção. Elimina complexidade de taxonomia desnecessária para a vendedora e cliente.

---

## 4. Sacola de Desejos e Atendimento WhatsApp

### Decisão

A adição de peças à Sacola de Desejos é feita com um clique direto sobre o cartão de produto, sem modais ou seletores de tamanho no catálogo (Decisão de Esclarecimento nº 1: _"sem seleção de tamanho no catálogo"_).

- A Sacola de Desejos é exibida em gaveta lateral deslizante (_Sheet/Drawer_ no estilo shadcn/ui).
- O fechamento aciona a geração da URL `https://wa.me/{numero}?text={mensagem}`, estruturando o texto com a lista de peças, valores e pedido de alinhamento de tamanhos com a vendedora.

### Raciocínio

- Elimina barreiras de compra na vitrine e transfere o atendimento consultivo para o canal natural de vendas (WhatsApp).

---

## 5. Modelo de Dados e Persistência

### Decisão

- Manter o modelo `Product` do Prisma existente (`id`, `name`, `priceInCents`, `imageUrl`, `active`, `sortOrder`, `createdAt`).
- Expandir o modelo `ShopConfig` para armazenar `topAnnouncement` (texto da barra superior de avisos), mantendo como fallback o padrão da Canal Concept (`"FRETE GRÁTIS ACIMA DE R$ 599,00 | PARCELE EM ATÉ 10X SEM JUROS"`).
- O nome da loja e o logotipo permanecem fixos como **Canal Concept** na vitrine pública (Decisão de Esclarecimento nº 3).

### Raciocínio

- Mudança mínima e não destrutiva no banco de dados, preservando os dados atuais e permitindo flexibilidade para comunicados sazonais da loja.
