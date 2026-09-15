# 🛍️ Catálogo Canal WhatsApp

Uma plataforma moderna e performática de catálogo digital projetada para integrar perfeitamente a jornada de compra via WhatsApp. O sistema possui uma vitrine pública para clientes (com lista de desejos inteligente) e um painel administrativo intuitivo para gestão do catálogo.

## 🚀 Tecnologias e Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- **Linguagem**: TypeScript
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Banco de Dados**: PostgreSQL ([Neon Database](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Armazenamento de Mídia**: [UploadThing](https://uploadthing.com/)
- **UI & Componentes**: [Lucide React](https://lucide.dev/) (ícones), [@dnd-kit](https://dndkit.com/) (para drag-and-drop no admin)
- **Testes (E2E)**: [Playwright](https://playwright.dev/)
- **Geração de PDF**: `pdf-lib` + `puppeteer`

## ✨ Principais Funcionalidades

### 🛒 Área Pública (Cliente)
- **Vitrine Mobile-First**: Visualização otimizada de produtos com layout limpo focado na conversão (375px base design).
- **Lista de Desejos (Wishlist)**: Adição e remoção de produtos, cálculo automático do total, deduplicação silenciosa de itens repetidos.
- **Integração Nativa com WhatsApp**: Envio da lista de desejos diretamente para a vendedora via `wa.me` com resumo formatado de itens, links das imagens e preço total.
- **Geração de PDF do Catálogo**: Opção de download rápido em PDF das peças da vitrine.

### ⚙️ Painel Administrativo
- **Autenticação Segura**: Acesso rápido protegido por senha, utilizando sessão assinada por HMAC (`httpOnly` cookies).
- **Gestão de Produtos (CRUD)**: Criação, inativação e atualização de peças (nome, preço, foto).
- **Reordenação Drag-and-Drop**: Controle total da ordem de exibição na vitrine pública, manipulando os cards diretamente no painel.
- **Configuração da Loja**: Definição dinâmica do número de WhatsApp que receberá os pedidos.

## 📦 Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- Node.js `v20+` (Recomendado v24+)
- Conta no [Neon](https://console.neon.tech) para o banco PostgreSQL
- Conta no [UploadThing](https://uploadthing.com) para salvar as imagens

### 2. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto, baseado em `.env.example`:

```env
# Conexão PostgreSQL
DATABASE_URL="postgresql://usuario:senha@seu-host.aws.neon.tech/neondb?sslmode=require"

# Autenticação do Admin
ADMIN_PASSWORD="sua_senha_segura"
ADMIN_SESSION_SECRET="uma_chave_super_secreta_com_pelo_menos_32_caracteres"

# UploadThing
UPLOADTHING_TOKEN="seu_token_aqui"

# (Opcional) URL da aplicação
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Aviso de Segurança**: Mantenha o arquivo `.env` sempre adicionado no seu `.gitignore`. Nunca realize o commit de chaves de produção ou senhas.

### 3. Instalação e Banco de Dados

```bash
# 1. Instalar as dependências
npm install

# 2. Sincronizar schema do Prisma com o BD
npx prisma db push

# 3. Gerar client do Prisma
npx prisma generate
```

### 4. Executando a Aplicação

```bash
npm run dev
```

A aplicação estará disponível nas seguintes rotas:
- **Catálogo (Clientes)**: [http://localhost:3000](http://localhost:3000)
- **Login Admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Painel Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🧪 Testes E2E (Playwright)

Para garantir a qualidade, o projeto possui testes automatizados End-To-End cobrindo fluxos de usuário:

```bash
# Instalar binários dos navegadores na primeira execução
npx playwright install --with-deps chromium

# Rodar todos os testes em background
npm run test:e2e

# Rodar os testes em modo visual (UI)
npm run test:e2e:ui
```

## 📐 Padrões e Arquitetura

Este repositório segue os princípios descritos no manifesto técnico da aplicação (ver pasta `specs/`):
- **Server Components (RSC) por padrão**: Uso mínimo do `'use client'`, restrito a formulários interativos, dnd-kit e Zustand/Contexts.
- **Server Actions**: Validações de segurança nos mutations do Admin.
- **Isolamento Modular**: Divisão em `modules/` (ex: `admin`, `catalog`, `wishlist`) dentro de `src/` visando fácil manutenção e escalabilidade horizontal.
- **Validação Antecipada**: TypeScript rígido limitando surpresas em tempo de execução.

---
*Criado com Next.js, Prisma e muito ☕.*
