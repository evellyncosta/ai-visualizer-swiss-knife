## Context

O modo `path` limita cada resposta a um token e o cliente solicita outra resposta
após toda escolha. O novo modo produzirá segmentos de no máximo 30 tokens.
Consulte `proposal.md` para a motivação e a especificação delta para o
comportamento observável.

## Goals / Non-Goals

**Goals:**

- Manter uma única geração do modelo como fonte de etapas consecutivas em cada
  segmento de um caminho.
- Conservar a árvore local e seu comportamento de retomada.
- Limitar chamadas adicionais à criação de um ramo alternativo.

**Non-Goals:**

- Manter estado de geração, sessão ou árvore no servidor.
- Gerar antecipadamente todas as alternativas possíveis.
- Alterar os modos `word` ou `text`.

## Decisions

### Segmentos contínuos com cursor no cliente

Uma solicitação `path` retorna uma resposta de vários tokens e os dados de
logprob correspondentes. Cada nó do caminho referencia o segmento ao qual
pertence e a etapa seguinte desse segmento. Ao aceitar o token selecionado pelo
modelo, o cliente cria o nó e avança o cursor local; nenhuma chamada é feita até
que a sequência acabe ou uma alternativa seja escolhida.

Isso preserva a continuidade produzida pelo provedor e reduz latência e custo.
Solicitar um token por vez foi descartado porque cada resposta de chat é uma nova
geração. Pré-calcular uma árvore completa foi descartado pelo crescimento
combinatório e custo.

### Uma nova sequência apenas após divergência

Os candidatos de cada etapa continuam a derivar de `top_logprobs`, incluindo o
token selecionado se o provedor não o listar. Se a escolha difere desse token, o
cliente materializa o prefixo da raiz até a escolha e solicita um segmento novo.
O token alternativo torna-se parte do prefixo antes da nova geração; as etapas
posteriores desse segmento passam a ser reveladas localmente.

Como o provedor inicia um novo turno a cada requisição de chat, uma mensagem
anterior de `assistant` não é um prefill confiável para retomar a mesma resposta.
Toda solicitação `path` deve, portanto, enviar o contexto textual como mensagem
de `user`: a premissa na solicitação inicial e a premissa acrescida do prefixo
escolhido em uma ramificação. Cada solicitação ainda retorna até 30 tokens de uma
única geração e o cliente não solicita novas gerações ao seguir esses tokens.

Usar histórico de `assistant` foi descartado porque pode fazer o provedor iniciar
outro turno de assistant após o texto preexistente e produzir repetições ou
fragmentos incoerentes.

### Premissa e resposta em áreas distintas

A premissa permanece um dado de entrada da pessoa e também é o contexto da
mensagem `user` inicial. O cliente conservará os valores em campos separados: a
raiz mantém a premissa e cada nó mantém somente o prefixo da resposta. A área de
caminho ativo exibirá a premissa como contexto e a resposta do assistant como
texto independente, sem concatená-los ou inserir espaços de compensação.

Essa separação torna a interface coerente com a estrutura da conversa e preserva
fielmente os tokens retornados, inclusive quando o primeiro token não começa com
espaço. Concatenar os dois textos ou acrescentar um delimitador invisível foi
descartado porque alteraria o conteúdo observado e suas probabilidades.

### Contrato e validação da sequência

O modo `path` continua usando o endpoint de geração existente e devolvendo
`text`, `tokenProbs` e `promptTokens`, mas passa a aceitar uma lista não vazia de
tokens. A validação exige que a concatenação dos tokens selecionados seja igual ao
texto retornado e conserva todos os valores exatamente como recebidos. O perfil
de prompt passa a solicitar uma continuação curta de múltiplos tokens, com limite
de 30 tokens para cada segmento.

Manter outro endpoint foi descartado para evitar duplicar validação, erros,
telemetria e configuração do modelo.

### Fim de segmento

Quando o cursor alcança o último token de um segmento, o cliente informa que
aquela continuação foi completamente revelada e não faz uma solicitação adicional.
Uma nova chamada no modo `path` é reservada exclusivamente para uma escolha
alternativa. Essa regra torna a sequência exibida uma representação fiel e finita
da geração original.

## Risks / Trade-offs

- [Um limite curto encerra cedo a exploração linear] → escolher um limite de
  geração de 30 tokens e indicar claramente quando ela foi completamente
  revelada.
- [O contexto de uma ramificação pode ficar longo] → limitar cada segmento e
  enviar somente a premissa e o prefixo necessário, respeitando o limite do
  provedor.
- [A resposta do provedor pode conter logprobs ausentes ou texto inconsistente]
  → rejeitar a resposta com o mesmo tratamento seguro de erro já usado no
  endpoint.
- [A demonstração estática não representa geração real] → fornecer uma sequência
  estática com múltiplas etapas e ramificação simulada.

## Migration Plan

1. Atualizar o perfil e a validação do modo `path` para sequências contínuas.
2. Atualizar o cliente para armazenar segmentos, cursores e ramificações.
3. Atualizar a apresentação, a demonstração e os testes da navegação local para
   exibir premissa e resposta separadamente.
4. Publicar como mudança compatível: o endpoint e os campos de resposta não são
   removidos, mas consumidores de `path` devem aceitar mais de um token.
5. Em rollback, restaurar o perfil de um token e a navegação anterior; os modos
   `word` e `text` permanecem inalterados.
