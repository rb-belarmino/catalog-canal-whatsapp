# Quickstart & Validation Guide: Layout Moderno Canal Concept

**Feature Branch**: `002-layout-canal-concept`
**Date**: 2026-09-13

Este guia descreve os cenários de validação de ponta a ponta para verificar o layout moderno e atualizado inspirado na Canal Concept.

---

## 1. Pré-requisitos e Configuração

1. Certifique-se de que as dependências estão instaladas:

   ```bash
   npm install
   ```

2. Execute as migrações/atualização do banco de dados (se aplicável):

   ```bash
   npx prisma db push
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 2. Cenários de Validação Manual

### Cenário 1: Visualização da Vitrine Canal Concept (Desktop e Mobile)

1. Acesse `http://localhost:3000` em um navegador.
2. **Verifique**:
   - A barra superior de avisos está presente no topo exibindo mensagens institucionais/promocionais em caixa alta e espaçamento elegante.
   - O cabeçalho exibe o logotipo oficial da marca **Canal Concept**.
   - O fundo é claro e neutro (`#F7F7F7`).
   - A grade de produtos exibe as fotos em proporção vertical editorial (3:4).
   - O preço está formatado em R$ com opções de parcelamento ("ou até 10x sem juros") e benefício no PIX.
   - Em viewport mobile (ex.: 375px de largura), a grade se ajusta em 2 colunas nítidas e legíveis.

### Cenário 2: Busca Textual Rápida

1. Na vitrine, digite o nome de uma peça existente no campo de busca do cabeçalho (ex.: "Vestido" ou "Linho").
2. **Verifique**:
   - A listagem filtra os produtos instantaneamente.
   - A contagem de produtos reflete o resultado.
3. Limpe a busca e confirme que todas as peças retornam à tela.
4. Digite um termo inexistente (ex.: "XYZ999") e verifique a mensagem amigável com opção para restaurar a lista.

### Cenário 3: Adição à Sacola e Envio para o WhatsApp

1. Clique em "Adicionar à Sacola" em 2 peças distintas.
2. **Verifique**:
   - O item é adicionado diretamente sem solicitação de tamanho na vitrine.
   - O contador no ícone da sacola atualiza instantaneamente.
3. Abra a gaveta lateral (Sacola de Desejos).
4. Verifique a exibição das miniaturas, títulos, preços unitários e soma total.
5. Clique em "Finalizar no WhatsApp".
6. **Verifique**:
   - O link abre o WhatsApp direcionado para o número configurado com a mensagem contendo o nome da Canal Concept, itens, valores e texto solicitando alinhamento de tamanhos.

---

## 3. Testes Automatizados

Executar testes end-to-end com Playwright:

```bash
npm run test:e2e
```
