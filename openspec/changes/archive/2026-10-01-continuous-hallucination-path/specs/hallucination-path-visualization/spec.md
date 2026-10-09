## MODIFIED Requirements

### Requirement: Escolha iterativa do próximo token
O sistema SHALL gerar uma sequência contínua de múltiplos tokens para cada
solicitação de início ou ramificação do caminho, incluindo o token selecionado,
sua probabilidade e os candidatos de alta probabilidade de cada etapa. A pessoa
SHALL poder percorrer essa sequência um token por vez. Enquanto escolher o token
originalmente selecionado em cada etapa, o sistema SHALL revelar a etapa seguinte
já recebida, sem fazer uma nova solicitação de geração.

#### Scenario: Escolher o primeiro token
- **WHEN** a pessoa envia uma afirmação falsa e seleciona o token originalmente
  gerado na primeira etapa
- **THEN** o sistema SHALL registrar a escolha como o primeiro nó após a
  afirmação e SHALL apresentar os candidatos da segunda etapa da mesma sequência
  contínua sem solicitar uma nova geração

#### Scenario: Percorrer uma continuação contínua
- **WHEN** a pessoa seleciona tokens originalmente gerados em etapas sucessivas
- **THEN** o sistema SHALL acrescentar exatamente cada token escolhido ao
  contexto daquele caminho e SHALL exibir os candidatos pré-gerados da etapa
  seguinte na ordem retornada pelo modelo

#### Scenario: Preservar espaço ou quebra de linha do token
- **WHEN** a pessoa escolhe um token que contém espaço, tabulação ou quebra de
  linha
- **THEN** o sistema SHALL acrescentar o valor original do token ao contexto e
  SHALL representá-lo de forma visível sem alterar seu valor

### Requirement: Ramificação por escolha alternativa
O sistema SHALL iniciar uma nova geração contínua somente quando a pessoa
escolher, em uma etapa, um candidato diferente do token originalmente gerado
para essa etapa. A nova geração SHALL usar a afirmação inicial e o prefixo de
resposta do ramo, incluindo o token alternativo escolhido, como contexto. O
sistema SHALL preservar a sequência originalmente gerada e os demais ramos.

#### Scenario: Escolher uma alternativa
- **WHEN** a pessoa seleciona um candidato diferente do token originalmente
  gerado para o nó ativo
- **THEN** o sistema SHALL criar um filho com o token alternativo e SHALL
  solicitar uma nova sequência contínua para esse ramo

#### Scenario: Retomar um nó anterior e criar uma ramificação
- **WHEN** a pessoa seleciona um nó existente que não é a ponta do caminho e
  escolhe uma alternativa naquela etapa
- **THEN** o sistema SHALL preservar os filhos existentes, criar um novo ramo a
  partir daquele nó e tornar o novo ramo o caminho ativo

### Requirement: Contexto de geração de caminho
O sistema SHALL usar a afirmação inicial como contexto da primeira geração. Ao
criar uma ramificação, o sistema SHALL usar a afirmação inicial acrescida do
prefixo de resposta escolhido até aquele ponto como contexto de uma nova
sequência contínua. O sistema SHALL evitar solicitar gerações intermediárias
enquanto a pessoa segue os tokens originalmente gerados.

#### Scenario: Iniciar uma sequência a partir da premissa
- **WHEN** a pessoa inicia um caminho com uma afirmação inicial
- **THEN** o sistema SHALL gerar uma sequência contínua usando essa afirmação
  como contexto de entrada

#### Scenario: Gerar uma ramificação a partir de um prefixo
- **WHEN** a pessoa escolhe um token alternativo em um caminho
- **THEN** o sistema SHALL gerar uma sequência contínua usando a afirmação
  inicial e o prefixo daquele ramo como contexto de entrada

### Requirement: Leitura do caminho construído
O sistema SHALL exibir a afirmação inicial e a resposta formada pelos tokens do
caminho ativo em áreas visuais separadas. A resposta SHALL conter somente os
tokens escolhidos, na ordem em que foram escolhidos, sem inserir, remover ou
normalizar espaços, tabulações, quebras de linha ou pontuação. O sistema SHALL
permitir finalizar a exploração sem classificar automaticamente o texto produzido
como verdadeiro ou falso.

#### Scenario: Exibir a resposta separada da premissa
- **WHEN** a pessoa inicia ou percorre um caminho
- **THEN** o sistema SHALL manter a afirmação inicial visível separadamente da
  resposta do assistant e SHALL evitar concatenar visualmente ambas como uma
  única cadeia de texto

#### Scenario: Alternar o caminho ativo
- **WHEN** a pessoa seleciona um nó pertencente a outro ramo
- **THEN** o sistema SHALL manter a afirmação inicial e SHALL atualizar somente
  a resposta para refletir os tokens da raiz até o nó selecionado

#### Scenario: Finalizar exploração
- **WHEN** a pessoa encerra a exploração de um caminho
- **THEN** o sistema SHALL preservar a árvore, a afirmação inicial e a resposta
  construída e SHALL evitar apresentar uma conclusão factual automática
