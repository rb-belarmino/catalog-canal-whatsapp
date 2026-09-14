# Feature Specification: Layout Moderno e Atualizado Inspirado na Canal Concept

**Feature Branch**: `002-layout-canal-concept`

**Created**: 2026-09-13

**Status**: Draft

**Input**: Layout moderno e atualizado referenciado conforme o site oficial da marca Canal (https://www.canal.com.br/), adaptando a vitrine digital e a experiência da cliente ao padrão estético contemporâneo e minimalista da marca, integrado ao fluxo de compras via WhatsApp.

## Clarifications

### Session 2026-09-13

- Q: Como a seleção de tamanhos das peças (ex.: P, M, G ou 36, 38, 40) deve ser tratada quando a cliente adiciona um item à Sacola de Desejos? → A: Sem seleção de tamanho no catálogo (Opção B); a vitrine mantém foco estético minimalista em foto, nome e preço, e a confirmação de disponibilidade de tamanho ou ajustes é alinhada diretamente na conversa com a vendedora no WhatsApp.
- Q: Como a lista de categorias de roupas (ex.: Blazers, Blusas, Calças, Casacos, Vestidos, Jeans, Tricot) deve ser gerenciada no sistema? → A: Não terá categorias; o catálogo não terá abas ou divisão por categorias. A vitrine exibirá todas as peças em uma listagem única, elegante e contínua, com pesquisa textual rápida para localização de itens.
- Q: O catálogo deve utilizar diretamente a marca e logotipo oficiais da "CANAL CONCEPT" ou manter o nome da loja e logotipo editáveis no painel administrativo? → A: Marca oficial Canal Concept (Opção A); o catálogo adota diretamente a marca Canal Concept com seu logotipo e identidade visual oficial; no painel administrativo a vendedora gerencia o WhatsApp de atendimento, os produtos cadastrados e a barra de avisos.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Cliente visualiza a vitrine com estética visual oficial Canal Concept (Priority: P1)

A cliente acessa o link do catálogo em seu celular ou computador e visualiza uma vitrine com a identidade de marca oficial Canal Concept: fundo claro neutro (#F7F7F7), tipografia geométrica refinada em caixa alta com espaçamento elegante (tracking), barra superior de avisos/benefícios ("FRETE GRÁTIS ACIMA DE R$ 599,00", "DESCONTO DE 5% NO PIX", "PARCELE EM ATÉ 10X SEM JUROS"), cabeçalho minimalista com logotipo oficial Canal Concept e grade contínua de produtos com fotografia editorial em formato vertical.

**Why this priority**: A identidade visual e a primeira impressão são o núcleo desta especificação. Ao adotar a marca oficial Canal Concept, o catálogo estabelece fidelidade completa ao site de referência da marca.

**Independent Test**: Pode ser testado acessando o catálogo por dispositivo móvel e desktop, verificando a presença da barra de benefícios, o cabeçalho clean com o logotipo oficial Canal Concept, o esquema de cores neutro minimalista e os cartões de produtos com proporção editorial vertical, tipografia refinada e exibição de preços e condições.

**Acceptance Scenarios**:

1. **Given** que a cliente acessa a página inicial do catálogo,
   **When** a página termina de carregar,
   **Then** a cliente visualiza a barra superior de avisos com comunicados promocionais da marca, o logotipo oficial da Canal Concept no cabeçalho e a grade de produtos em estética minimalista com fundo claro (#F7F7F7/neutro).

2. **Given** que a cliente está navegando na grade de produtos,
   **When** visualiza cada cartão de peça,
   **Then** o cartão exibe a fotografia principal em proporção vertical editorial, o nome da peça em tipografia limpa, o valor à vista e o indicativo de facilidades de pagamento (parcelamento e desconto no PIX).

3. **Given** que a cliente acessa o catálogo em um smartphone,
   **When** rola a tela para baixo,
   **Then** o cabeçalho mantém-se fixo ou recolhido de forma suave, mantendo acesso rápido à busca e à sacola de desejos sem obstruir a visualização dos produtos em grade de duas colunas perfeitamente ajustada.

---

### User Story 2 — Cliente pesquisa peças e filtra a vitrine por busca textual rápida (Priority: P1)

A cliente navega pela vitrine única de peças e utiliza um campo de busca rápida em tempo real para encontrar roupas por nome, estilo ou características (ex.: "Linho", "Preto", "Alfaiataria", "Regata"), filtrando instantaneamente a exibição.

**Why this priority**: Sem divisão por categorias, a busca por texto torna-se a principal ferramenta de localização ágil de peças no catálogo para clientes que buscam algo específico.

**Independent Test**: Pode ser testado digitando um termo na busca e confirmando que a grade atualiza imediatamente exibindo apenas os itens correspondentes com a contagem de resultados.

**Acceptance Scenarios**:

1. **Given** que a cliente deseja encontrar uma peça específica,
   **When** ela digita "Linho" no campo de busca do cabeçalho,
   **Then** a grade exibe instantaneamente apenas as peças que contenham "Linho" no nome, com transição visual suave.

2. **Given** que a cliente limpa o campo de busca,
   **When** o campo fica vazio,
   **Then** a vitrine volta a apresentar a coleção completa de peças.

3. **Given** que o termo digitado não corresponde a nenhuma peça,
   **When** a busca é processada,
   **Then** uma mensagem elegante orienta a cliente com a opção "Ver Todas as Peças" para restaurar a vitrine.

---

### User Story 3 — Cliente gerencia a Sacola de Desejos com visual minimalista e envia para o WhatsApp (Priority: P2)

Ao se interessar por uma peça, a cliente adiciona o produto diretamente à sua **Sacola de Desejos** com um único clique (sem bloqueios ou formulários intermediários). Um botão flutuante e gaveta lateral deslizante exibem os itens selecionados, miniaturas das fotos, preços unitários e soma total. Ao clicar em "Finalizar Atendimento via WhatsApp", a mensagem é montada de forma impecável e a cliente é encaminhada para o WhatsApp da vendedora para alinhar tamanhos e pagamento.

**Why this priority**: Conecta a experiência de compra de alto padrão da vitrine Canal Concept com o canal de conversão no WhatsApp, permitindo fechamento de venda personalizado pela vendedora.

**Independent Test**: Pode ser testado adicionando duas peças, abrindo a gaveta lateral da sacola, conferindo o cálculo do valor total, removendo um item e acionando o envio da mensagem formatada para o WhatsApp.

**Acceptance Scenarios**:

1. **Given** que a cliente gostou de uma peça na vitrine,
   **When** ela clica na ação de adicionar à sacola,
   **Then** o produto é adicionado imediatamente sem solicitar seleção de tamanho, um indicador visual discreto confirma a adição e o ícone de sacola no cabeçalho/flutuante atualiza o contador numérico com destaque sutil.

2. **Given** que a cliente possui itens na sacola e abre o painel lateral de desejos,
   **When** o painel se abre,
   **Then** ela visualiza os produtos com imagem em miniatura, nome, preço, subtotal geral e o botão de ação principal "Enviar Pedido no WhatsApp".

3. **Given** que a cliente clica em "Enviar Pedido no WhatsApp",
   **When** o redirecionamento ocorre,
   **Then** o aplicativo de WhatsApp abre uma conversa com a vendedora contendo o texto formatado com saudação elegante, identificação da marca Canal Concept, lista detalhada das peças, valores individuais, valor total e mensagem para alinhamento de tamanhos e pagamento.

---

### User Story 4 — Vendedora personaliza avisos da barra de topo e WhatsApp de contato (Priority: P3)

No painel de gerenciamento, a vendedora ou administradora pode configurar os comunicados da barra superior de avisos (ex.: mensagens de frete, promoções da estação ou cupom especial) e atualizar o número de WhatsApp de atendimento, mantendo a vitrine Canal Concept sempre alinhada com as operações da loja.

**Why this priority**: Garante flexibilidade comercial para a loja comunicar campanhas sazonais e direcionar os atendimentos para o contato correto da equipe.

**Independent Test**: Pode ser testado acessando o painel gerencial, alterando a mensagem de aviso e conferindo a atualização na página pública.

**Acceptance Scenarios**:

1. **Given** que a administradora está no painel gerencial,
   **When** ela edita o comunicado da barra de topo para "FRETE GRÁTIS ACIMA DE R$ 599,00 | PARCELE EM ATÉ 10X",
   **Then** o catálogo público atualiza e exibe o novo texto na barra superior.

2. **Given** que a administradora atualiza o número de WhatsApp,
   **When** ela salva a alteração,
   **Then** os pedidos da sacola passam a ser encaminhados para o novo número.

---

### Edge Cases

- **Títulos de produtos muito longos**: Títulos extensos devem ser exibidos de forma harmônica com quebra de linha natural sem desalinhar a altura dos cartões vizinhos na grade.
- **Imagens com formatos ou proporções não uniformes**: As imagens devem ser enquadradas com ajuste proporcional elegante (sem corte de pontos focais essenciais ou distorção de aspecto).
- **Oscilações ou lentidão na conexão da cliente**: A página deve exibir telas de carregamento estruturadas (skeletons) com a mesma silhueta minimalista dos cartões de produto, evitando saltos visuais bruscos (layout shifts).
- **Preço zero ou ausência de preço cadastrado**: Se uma peça estiver cadastrada sem preço definido, exibir "Consulte Valores" com link direto para o WhatsApp.
- **Caracteres especiais na mensagem do WhatsApp**: O texto gerado para a conversa do WhatsApp deve suportar acentuação, quebras de linha e emojis sem quebras de formatação na URL.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir uma barra superior de avisos (top notification bar) com tipografia em caixa alta, espaçamento refinado e mensagens sobre benefícios da loja (ex.: frete, facilidades de pagamento, canal WhatsApp).
- **FR-002**: O sistema DEVE disponibilizar um cabeçalho moderno e minimalista contendo o logotipo oficial da marca Canal Concept, campo/botão de pesquisa textual e o ícone de sacola com contador de peças selecionadas.
- **FR-003**: O sistema DEVE apresentar a grade de produtos em estética editorial minimalista, com cartões que destacam a fotografia em proporção vertical, tipografia elegante e espaçada, nome e valor do produto.
- **FR-004**: Cada cartão de produto DEVE exibir o valor principal em moeda brasileira (R$) e, opcionalmente, o indicativo de opções de parcelamento sem juros e destaque para desconto no PIX.
- **FR-005**: O catálogo DEVE apresentar uma vitrine única e unificada com todas as peças disponíveis, sem divisões ou abas de categorias.
- **FR-006**: O sistema DEVE incluir busca dinâmica por texto no cabeçalho/topo da vitrine, filtrando instantaneamente os produtos por nome.
- **FR-007**: A cliente DEVE poder adicionar e remover peças de sua Sacola de Desejos diretamente com um clique (sem exigir escolha de tamanho ou formulários intermediários na vitrine), recebendo feedback visual imediato.
- **FR-008**: O sistema DEVE disponibilizar um painel deslizante (drawer) para a Sacola de Desejos, exibindo foto miniatura, nome, preço unitário, totalizador e botão de fechamento com a vendedora.
- **FR-009**: Ao confirmar a sacola, o sistema DEVE gerar um link de WhatsApp com o número da loja e uma mensagem padronizada contendo a relação dos produtos, fotos ou nomes, valores totais e observação para alinhamento de tamanho e finalização pela vendedora.
- **FR-010**: A interface DEVE ser totalmente responsiva (mobile-first), com layout fluido adaptado para smartphones e desktops em grade proporcional e elegante.
- **FR-011**: O sistema DEVE exibir estados visuais de carregamento (skeleton loading) que espelham a estrutura minimalista da vitrine para assegurar transições fluidas.
- **FR-012**: O painel administrativo DEVE permitir que a loja gerencie o número de WhatsApp de atendimento e personalize os comunicados da barra superior de avisos, mantendo a marca Canal Concept fixa na identidade visual da vitrine.

### Key Entities *(include if feature involves data)*

- **Produto (Product)**: Representa a peça de vestuário no catálogo. Atributos: Nome, Preço, Preço Promocional (opcional), URL da Imagem Principal, Status de Disponibilidade e Data de Criação (tamanhos são alinhados diretamente via atendimento humano).
- **Aviso de Barra de Topo (Top Announcement)**: Mensagens institucionais e promocionais exibidas no topo da página (ex.: "FRETE GRÁTIS ACIMA DE R$ 599,00", "DESCONTO DE 5% NO PIX").
- **Sacola de Desejos (Wishlist)**: Coleção temporária de itens selecionados pela cliente durante sua sessão de navegação, contendo referências aos produtos e cálculo do valor total.
- **Configuração da Loja (Shop Configuration)**: Informações da marca oficial Canal Concept exibidas na vitrine, incluindo número do WhatsApp para atendimento e mensagem da barra superior.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O tempo de carregamento da primeira visualização útil da vitrine em conexões móveis convencionais deve ser inferior a 2 segundos.
- **SC-002**: A cliente deve conseguir encontrar uma peça desejada através da busca textual e adicioná-la à sua sacola em menos de 15 segundos.
- **SC-003**: 100% dos cliques na ação de finalização no WhatsApp devem abrir a conversa preenchida com o resumo correto dos itens selecionados e os valores somados.
- **SC-004**: O design e a usabilidade em dispositivos móveis devem alcançar pontuação de acessibilidade e usabilidade sem sobreposição de botões ou quebra de elementos visuais em telas a partir de 320px de largura.
- **SC-005**: 90% ou mais das usuárias testadas devem avaliar a interface como intuitiva, sofisticada e fiel à experiência de marca da Canal Concept.

---

## Assumptions

- O catálogo adota fixamente a marca oficial Canal Concept com logotipo e identidade visual minimalista correspondente.
- O catálogo é público e voltado para a cliente final visualizar e montar sua lista de desejos sem necessidade de criar conta ou realizar login prévio.
- O catálogo não possui separação por categorias de produtos; todas as peças são exibidas em uma vitrine unificada e contínua com busca por texto.
- O alinhamento de tamanhos, negociação de frete e pagamento são conduzidos pela vendedora através do WhatsApp oficial da loja.
- A paleta de cores e o estilo tipográfico adotarão os padrões visuais limpos e modernos da Canal Concept (tons monocromáticos neutros, fundo claro off-white `#F7F7F7`, tipografia sem serifa geométrica refinada em caixa alta).
