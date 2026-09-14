# Feature Specification: Catálogo de Roupas com Canal WhatsApp

**Feature Branch**: `001-catalogo-whatsapp`

**Created**: 2026-09-12

**Status**: Draft

**Input**: Criar um catálogo de roupas de uma loja com imagem, nome e preço; gerenciado pela vendedora via admin; cliente visualiza e seleciona roupas na "Lista de Desejos"; ao confirmar, é redirecionada ao WhatsApp com os itens selecionados formatados.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Vendedora gerencia o catálogo (Priority: P1)

A vendedora acessa o painel administrativo, faz login com suas credenciais e gerencia os produtos
do catálogo: adiciona novas peças (com foto, nome e preço), edita informações de peças existentes
e remove peças que saíram de estoque.

**Why this priority**: Sem produtos no catálogo nenhuma outra funcionalidade tem valor. É o
fundamento de toda a plataforma.

**Independent Test**: Pode ser testado isoladamente fazendo login no admin, criando um produto com
foto, nome e preço, e verificando que ele aparece na listagem do catálogo público. Entrega valor
imediato pois a vendedora já consegue montar o catálogo.

**Acceptance Scenarios**:

1. **Given** a vendedora está na tela de login do admin,
   **When** ela insere credenciais válidas e confirma,
   **Then** ela é redirecionada ao painel de gerenciamento de produtos.

2. **Given** a vendedora está no painel admin,
   **When** ela preenche nome, preço e faz upload de uma foto de uma peça e salva,
   **Then** a nova peça aparece imediatamente no catálogo público com foto, nome e preço corretos.

3. **Given** a vendedora visualiza uma peça existente no admin,
   **When** ela altera o preço e salva,
   **Then** o catálogo público exibe o preço atualizado.

4. **Given** a vendedora visualiza uma peça existente no admin,
   **When** ela clica em remover e confirma a exclusão,
   **Then** a peça deixa de aparecer no catálogo público.

5. **Given** a vendedora tenta fazer login com credenciais inválidas,
   **When** ela confirma o formulário,
   **Then** uma mensagem de erro amigável é exibida e o acesso não é concedido.

---

### User Story 2 — Cliente visualiza o catálogo (Priority: P1)

A cliente acessa o catálogo pelo link compartilhado pela vendedora (via WhatsApp ou redes sociais)
sem precisar criar conta ou fazer login. Ela navega pelas peças, visualizando foto, nome e preço
de cada uma.

**Why this priority**: É o ponto de entrada da cliente — sem visualização do catálogo o resto do
fluxo não existe.

**Independent Test**: Pode ser testado acessando a URL pública do catálogo sem autenticação e
verificando que as peças cadastradas aparecem com foto, nome e preço. Entrega valor pois já
substitui o envio manual de fotos no WhatsApp.

**Acceptance Scenarios**:

1. **Given** uma cliente acessa a URL pública do catálogo,
   **When** a página carrega,
   **Then** ela vê todas as peças cadastradas em formato de grade com foto, nome e preço, sem
   necessidade de login.

2. **Given** a cliente está navegando no catálogo em um celular,
   **When** ela visualiza as peças,
   **Then** a interface é legível e usável em tela pequena, sem necessidade de zoom.

3. **Given** nenhum produto está cadastrado no catálogo,
   **When** a cliente acessa a URL pública,
   **Then** uma mensagem amigável informa que o catálogo está sendo preparado (não uma tela vazia).

4. **Given** a cliente está visualizando o catálogo,
   **When** as imagens estão carregando,
   **Then** placeholders visuais (skeleton screens) são exibidos enquanto aguarda o carregamento.

---

### User Story 3 — Cliente monta sua Lista de Desejos (Priority: P2)

A cliente seleciona as peças que mais gostou adicionando-as à sua **Lista de Desejos**. Ela pode
remover peças da lista e visualizar o total acumulado dos itens selecionados.

**Why this priority**: É o mecanismo de curadoria — sem ele a cliente não consegue comunicar suas
escolhas à vendedora de forma estruturada.

**Independent Test**: Pode ser testado adicionando 3 peças distintas à Lista de Desejos,
verificando que aparecem com foto, nome e preço individual, que o total acumulado é calculado
corretamente, e que é possível remover uma peça. Entrega valor pois resolve a comunicação de
interesse da cliente.

**Acceptance Scenarios**:

1. **Given** a cliente está visualizando uma peça no catálogo,
   **When** ela clica em "Adicionar à Lista de Desejos",
   **Then** a peça é adicionada com feedback visual imediato (animação ou confirmação), e o
   contador da Lista de Desejos é atualizado.

2. **Given** a cliente tem peças na Lista de Desejos,
   **When** ela abre a Lista de Desejos,
   **Then** ela vê cada peça com foto em miniatura, nome e preço individual, além do total
   acumulado de todos os itens selecionados.

3. **Given** a cliente tem uma peça na Lista de Desejos,
   **When** ela clica em remover essa peça,
   **Then** a peça é removida da lista e o total é recalculado.

4. **Given** a cliente fechou e reabriu o navegador,
   **When** ela acessa o catálogo novamente na mesma sessão/dispositivo,
   **Then** sua Lista de Desejos ainda contém as peças selecionadas anteriormente.

5. **Given** a Lista de Desejos está vazia,
   **When** a cliente abre a Lista de Desejos,
   **Then** uma mensagem amigável convida a adicionar peças (não uma tela em branco).

---

### User Story 4 — Cliente envia a Lista de Desejos ao WhatsApp da vendedora (Priority: P2)

Com sua Lista de Desejos montada, a cliente clica em "Enviar para a vendedora" e é redirecionada
ao WhatsApp com uma mensagem pré-formatada listando todas as peças selecionadas (nome, preço e
link da imagem), além do total acumulado.

**Why this priority**: É o momento de conversão — onde o interesse da cliente se transforma em
contato comercial real com a vendedora.

**Independent Test**: Pode ser testado adicionando 2 peças à Lista de Desejos, clicando em
"Enviar para a vendedora" e verificando que o WhatsApp é aberto com mensagem contendo nome,
preço de cada peça e total. Entrega valor pois fecha o ciclo de interesse→contato.

**Acceptance Scenarios**:

1. **Given** a cliente tem ao menos uma peça na Lista de Desejos,
   **When** ela clica em "Enviar para a vendedora",
   **Then** o aplicativo WhatsApp (ou WhatsApp Web em desktop) é aberto com mensagem
   pré-formatada contendo: saudação, lista de peças (nome + preço + link da imagem de cada uma)
   e total acumulado.

2. **Given** a mensagem é gerada para o WhatsApp,
   **When** a cliente visualiza a mensagem no WhatsApp antes de enviar,
   **Then** a mensagem está em português, com emojis leves, legível e organizada.

3. **Given** a cliente está em um celular,
   **When** ela clica em "Enviar para a vendedora",
   **Then** o aplicativo WhatsApp nativo é aberto (não o WhatsApp Web).

4. **Given** a cliente está em um computador,
   **When** ela clica em "Enviar para a vendedora",
   **Then** o WhatsApp Web é aberto em uma nova aba.

5. **Given** a Lista de Desejos está vazia,
   **When** a cliente tenta clicar em "Enviar para a vendedora",
   **Then** o botão está desabilitado ou uma mensagem orienta a adicionar peças antes de enviar.

---

### User Story 5 — Vendedora configura o número de WhatsApp (Priority: P3)

A vendedora configura no painel admin o número de WhatsApp para o qual as clientes serão
redirecionadas ao enviar a Lista de Desejos. Ela também pode atualizar o número caso mude.

**Why this priority**: É configuração operacional — necessária para o fluxo funcionar, mas pode
ser definida uma única vez na configuração inicial.

**Independent Test**: Pode ser testado configurando um número de WhatsApp no admin, depois
verificando que ao clicar em "Enviar para a vendedora" no catálogo público, o redirecionamento
usa esse número.

**Acceptance Scenarios**:

1. **Given** a vendedora está no painel admin,
   **When** ela acessa as configurações e insere um número de WhatsApp válido (com DDD e código
   do país),
   **Then** o número é salvo e usado em todos os redirecionamentos das clientes.

2. **Given** o número de WhatsApp está configurado,
   **When** uma cliente clica em "Enviar para a vendedora",
   **Then** o redirecionamento usa exatamente o número configurado pela vendedora.

---

### Edge Cases

- O que acontece quando a cliente tenta acessar o catálogo sem conexão com a internet?
  → Exibir mensagem de erro de conexão amigável.
- O que acontece se uma imagem de produto falha ao carregar?
  → Exibir imagem placeholder com ícone neutro, sem quebrar o layout.
- O que acontece se a vendedora fizer upload de uma imagem muito grande (ex: > 8MB)?
  → O sistema deve informar o limite de tamanho de forma clara (máximo de 8MB) e não tentar enviar o arquivo.
- O que acontece se a cliente tentar adicionar a mesma peça duas vezes à Lista de Desejos?
  → A segunda adição é silenciosamente ignorada — a peça permanece na lista uma única vez e o
  total não é alterado. Nenhuma mensagem de erro é exibida; o botão de adição pode indicar
  visualmente que a peça já está na lista (ex: ícone preenchido).
- O que acontece se o número de WhatsApp não estiver configurado no admin?
  → O botão "Enviar para a vendedora" exibe uma mensagem informando que o contato não está
  disponível no momento.
- O que acontece se a URL de redirecionamento do WhatsApp exceder o limite de caracteres?
  → A mensagem deve ser truncada de forma segura, priorizando os primeiros itens e o total.

## Clarifications

### Session 2026-09-12

- Q: A Lista de Desejos permite selecionar a mesma peça mais de uma vez (com quantidade), ou cada peça aparece apenas uma vez? → A: Sem quantidade — cada peça aparece uma única vez; tentar adicionar novamente é ignorado silenciosamente.
- Q: O catálogo oferece alguma forma de organização ou filtragem das peças para a cliente, ou todas as peças aparecem em uma única grade sem filtros? → A: Grade única sem filtros — todas as peças exibidas na ordem cadastrada pela vendedora, sem categorias ou ordenação pela cliente.
- Q: Quando a sessão da vendedora expira ou ela fica inativa no painel admin, o que deve acontecer? → A: Sessão permanente — a vendedora permanece logada indefinidamente até clicar explicitamente em "Sair".
- Q: A vendedora consegue definir a ordem de exibição das peças no catálogo, ou os produtos aparecem sempre na ordem em que foram cadastrados? → A: Reordenação manual — a vendedora pode arrastar e soltar as peças no admin para definir a ordem de exibição no catálogo público.
- Q: Quando a mensagem para o WhatsApp é gerada, as imagens dos produtos são incluídas como links individuais por item, ou a mensagem contém apenas nomes e preços? → A: Link de imagem por item — cada peça na mensagem inclui nome, preço e a URL da foto individualmente.

---

## Requirements _(mandatory)_

### Functional Requirements

**Catálogo Público (visão da cliente):**

- **FR-001**: O catálogo DEVE ser acessível publicamente por URL, sem necessidade de autenticação.
- **FR-002**: Cada produto DEVE exibir: foto, nome da peça e preço em reais (BRL).
- **FR-003**: O catálogo DEVE exibir todos os produtos ativos em uma única grade, na ordem manualmente definida pela vendedora no admin, sem filtros ou categorias.
- **FR-004**: O catálogo DEVE funcionar em dispositivos móveis sem perda de usabilidade.
- **FR-005**: O catálogo DEVE exibir skeleton screens enquanto os produtos carregam.
- **FR-006**: O catálogo DEVE exibir mensagem amigável quando não houver produtos cadastrados.

**Lista de Desejos:**

- **FR-007**: A cliente DEVE poder adicionar qualquer produto do catálogo à sua Lista de Desejos
  com um único toque/clique.
- **FR-008**: A adição à Lista de Desejos DEVE fornecer feedback visual imediato ao usuário.
- **FR-009**: A Lista de Desejos DEVE exibir foto em miniatura, nome e preço de cada item.
- **FR-010**: A Lista de Desejos DEVE exibir o total acumulado dos preços dos itens selecionados.
- **FR-011**: A cliente DEVE poder remover itens individuais da Lista de Desejos.
- **FR-012**: O conteúdo da Lista de Desejos DEVE persistir entre sessões no mesmo dispositivo.
- **FR-013**: A Lista de Desejos DEVE estar acessível de qualquer tela do catálogo.
- **FR-014**: A Lista de Desejos DEVE exibir mensagem amigável quando estiver vazia.

**Redirecionamento ao WhatsApp:**

- **FR-015**: O sistema DEVE gerar uma mensagem formatada com: saudação, lista de peças
  (nome + preço + link de imagem para cada peça) e total acumulado.
- **FR-016**: Ao clicar em "Enviar para a vendedora", a cliente DEVE ser redirecionada ao
  WhatsApp com a mensagem pré-preenchida e pronta para envio.
- **FR-017**: O redirecionamento DEVE abrir o app WhatsApp em celular e o WhatsApp Web em desktop.
- **FR-018**: O botão "Enviar para a vendedora" DEVE estar desabilitado quando a Lista de Desejos
  estiver vazia.
- **FR-019**: Se o número de WhatsApp não estiver configurado, o botão DEVE exibir aviso adequado.

**Painel Administrativo (visão da vendedora):**

- **FR-020**: O painel admin DEVE ser protegido por autenticação (login + senha). A sessão da vendedora DEVE ser permanente — ela permanece autenticada até clicar explicitamente em "Sair".
- **FR-021**: A vendedora DEVE poder adicionar produtos ao catálogo informando: foto (upload
  direto), nome e preço.
- **FR-022**: A vendedora DEVE poder editar nome, preço e foto de qualquer produto existente.
- **FR-023**: A vendedora DEVE poder remover produtos do catálogo, com confirmação antes de
  excluir.
- **FR-024**: A vendedora DEVE poder configurar o número de WhatsApp de destino das clientes.
- **FR-025**: O painel admin DEVE fornecer feedback visual de sucesso/erro para todas as ações.
- **FR-026**: A vendedora DEVE poder reordenar as peças do catálogo via arrastar e soltar no
  painel admin; a nova ordem DEVE ser refletida imediatamente no catálogo público.

### Key Entities

- **Produto**: Representa uma peça de roupa no catálogo. Atributos: identificador único, nome,
  preço (valor numérico em BRL), URL da imagem, status (ativo/inativo), ordem de exibição
  (número inteiro definido pela vendedora via reordenação manual), data de criação e data
  de atualização.

- **Lista de Desejos**: Seleção temporária de produtos feita pela cliente. Atributos: lista de
  produtos selecionados, total acumulado. Não está associada a um usuário autenticado — persiste
  localmente no dispositivo da cliente.

- **Configuração da Loja**: Parâmetros operacionais gerenciados pela vendedora. Atributos: número
  de WhatsApp de contato (formato internacional), nome da loja (para exibição no catálogo).

- **Sessão Admin**: Credencial de acesso da vendedora ao painel administrativo. Não há cadastro
  público — o acesso é único e configurado na inicialização da plataforma.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A cliente consegue acessar o catálogo, adicionar peças à Lista de Desejos e enviar
  ao WhatsApp em no máximo 3 taps/cliques em dispositivo móvel, a partir da tela principal do
  catálogo.

- **SC-002**: O catálogo carrega e exibe os produtos em menos de 3 segundos em uma conexão móvel
  4G padrão.

- **SC-003**: A mensagem gerada para o WhatsApp contém 100% dos itens selecionados na Lista de
  Desejos, com nome e preço corretos para cada um.

- **SC-004**: A vendedora consegue adicionar um novo produto ao catálogo (incluindo upload de foto)
  em menos de 2 minutos, sem suporte técnico.

- **SC-005**: O catálogo é completamente utilizável em dispositivos com tela de 375px de largura
  (iPhone SE) sem scroll horizontal.

- **SC-006**: A Lista de Desejos persiste os itens selecionados após fechar e reabrir o navegador
  no mesmo dispositivo (100% de fidelidade dos dados).

- **SC-007**: O painel admin é acessível e operável sem treinamento formal, por uma usuária não
  técnica, com base apenas na interface.

---

## Assumptions

- A plataforma tem uma única vendedora/administradora — não há suporte a múltiplas contas admin
  nesta versão.
- Clientes não precisam criar conta nem se autenticar para visualizar o catálogo ou montar a
  Lista de Desejos.
- O número de WhatsApp configurado no admin é o único destino de todas as mensagens das clientes
  (não há seleção de vendedora pela cliente).
- O catálogo não implementa sistema de pagamento online — o fechamento de negócio ocorre
  inteiramente via conversa no WhatsApp.
- A "Lista de Desejos" não permite quantidades — cada peça é adicionada uma única vez (sem
  duplicatas).
- Imagens de produtos são hospedadas em serviço externo de armazenamento de arquivos (não no
  servidor de aplicação).
- O idioma da plataforma é exclusivamente português brasileiro.
- A plataforma não implementa gestão de estoque — a vendedora gerencia manualmente quais
  produtos estão disponíveis (adicionando/removendo do catálogo).
- O link de acesso ao catálogo é compartilhado manualmente pela vendedora (não há sistema de
  convites ou compartilhamento automatizado).
