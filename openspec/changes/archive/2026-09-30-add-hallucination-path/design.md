## Context

A aplicação Flask separa os modos Token e Texto por páginas, mas ambos usam o mesmo endpoint de geração e recebem a resposta inteira junto com logprobs por token. O navegador já sabe renderizar tokens, probabilidades e o contexto antes de cada escolha. O Hallucination Path exige uma interação diferente: uma solicitação por decisão, estado de árvore no navegador e a possibilidade de retomar qualquer nó para criar um ramo.

## Goals / Non-Goals

**Goals:**

- Retornar uma etapa de próximo token por solicitação, incluindo candidatos e probabilidades.
- Preservar no cliente uma árvore de escolhas, o caminho ativo e o texto acumulado.
- Reusar a aparência, a localização e a infraestrutura de geração existentes quando isso não conflitar com a experiência de árvore.
- Deixar explícito que a pessoa é responsável por fornecer uma premissa falsa e que não há fact-checking automático.

**Non-Goals:**

- Verificar a veracidade da premissa ou classificar factualidade do texto resultante.
- Gerar, armazenar ou pré-calcular continuações para todos os ramos possíveis.
- Persistir explorações entre recargas da página, compartilhar árvores ou alterar os modos existentes.

## Decisions

### Uma rodada de API para cada decisão

O endpoint existente aceitará um modo adicional, `path`, cujo perfil instrui o modelo a devolver somente o próximo token e limita a geração a um token. A resposta preservará o formato de probabilidades já usado pelo cliente, mas conterá uma única etapa selecionada e seus candidatos. O cliente usa os candidatos como escolhas; após uma escolha, envia o texto completo da raiz até o nó ativo para a nova rodada.

Essa abordagem mantém o servidor sem estado e deixa a criação de ramificações inteiramente no cliente. Alternativamente, o servidor poderia manter uma árvore por sessão, mas isso introduziria expiração, armazenamento e isolamento de sessão sem benefício para a primeira versão.

### Árvore local, identificada por nós imutáveis

O JavaScript do módulo manterá nós com identificador, identificador do pai, token escolhido, probabilidade, contexto acumulado, candidatos recebidos e lista de filhos. A raiz contém a afirmação inicial. Um único `activeNodeId` determina o contexto exibido e a origem da próxima solicitação.

Ao selecionar um nó existente, o cliente restaura seu contexto e candidatos. Ao selecionar um candidato, cria um filho sem substituir os filhos já presentes; desse modo, escolher outra alternativa em um nó anterior cria uma ramificação. Uma lista linear seria mais simples, mas não atenderia à exploração comparativa requerida.

### Renderização de árvore sem nova dependência

O módulo usará elementos HTML acessíveis para os nós e conectores visuais em CSS, com botões para seleção. Isso mantém a aplicação leve e compatível com o estilo atual. A árvore será apresentada como uma hierarquia navegável, com caminho ativo destacado e o token formatado para tornar espaços e quebras de linha visíveis.

Uma biblioteca de grafos foi considerada, mas a estrutura inicialmente pequena e sequencial não justifica uma dependência adicional. Se árvores grandes se tornarem difíceis de navegar, panorâmica/zoom ou um canvas poderá ser avaliado numa mudança futura.

### Separação do script e do template do novo modo

O novo template e um script dedicado evitam condicionar o fluxo linear de `script.js`. A página declarará `data-generation-mode="path"`, carregará localização compartilhada e incluirá áreas para orientação, árvore, candidatos, caminho ativo e entrada. As chaves de tradução novas serão incluídas nos dois idiomas já suportados.

### Validação compatível com um token arbitrário

O perfil `path` não aplicará a validação de palavra lexical do modo Token, porque tokens podem ser pontuação, espaço ou fragmentos de palavra. Ele validará que o provedor retornou exatamente uma etapa de token com conteúdo consistente com os logprobs. O limite de `top_k` existente continuará delimitando a quantidade de alternativas exibidas.

## Risks / Trade-offs

- [A API pode emitir mais de um token em condições inesperadas] -> Validar a resposta do modo `path` e retornar erro seguro se ela não representar uma única etapa.
- [Cada clique aumenta custo e latência] -> Mostrar estado de carregamento por etapa e solicitar geração somente após uma escolha explícita.
- [Árvores extensas podem ficar difíceis de ler em telas pequenas] -> Usar hierarquia vertical, texto quebrável e caminho ativo destacado; limitar a primeira versão à exploração manual sem expansão automática.
- [Usuários podem inserir uma premissa verdadeira] -> Exibir orientação e aviso claros; não alegar que o produto detecta alucinações.
- [Candidatos de logprob podem não incluir o token efetivamente selecionado] -> Inserir o token selecionado no conjunto de escolhas antes de renderizá-lo, preservando sua probabilidade.

## Migration Plan

1. Adicionar rota, template, estilos, localizações e perfil `path` sem modificar os contratos dos modos `word` e `text`.
2. Expor Hallucination Path como terceiro cartão na página inicial.
3. Cobrir o novo modo com testes de rota, validação de requisição, geração de um token e comportamento de cliente quando aplicável.
4. Em caso de rollback, remover o cartão e a rota do novo modo; o endpoint continuará compatível com os dois modos existentes.
