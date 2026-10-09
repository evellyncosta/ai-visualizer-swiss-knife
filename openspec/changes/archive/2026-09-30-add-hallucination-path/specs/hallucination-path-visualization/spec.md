## Purpose

Permitir que pessoas explorem visualmente como tokens escolhidos passo a passo podem construir continuações plausíveis a partir de uma afirmação factual falsa.

## ADDED Requirements

### Requirement: Entrada orientada por afirmação falsa
O modo Hallucination Path SHALL apresentar um campo para a pessoa informar uma afirmação factual falsa ou enganosa como contexto inicial. O modo SHALL explicar que a finalidade é explorar continuações linguisticamente plausíveis ancoradas nessa premissa e SHALL informar que não verifica automaticamente a falsidade da afirmação.

#### Scenario: Abrir o modo Hallucination Path
- **WHEN** a pessoa abre o modo Hallucination Path
- **THEN** o sistema SHALL mostrar a orientação para inserir uma afirmação factual falsa ou enganosa e o aviso de ausência de verificação factual automática

#### Scenario: Enviar contexto vazio
- **WHEN** a pessoa tenta iniciar uma exploração sem inserir uma afirmação
- **THEN** o sistema SHALL solicitar um contexto antes de mostrar candidatos de token

### Requirement: Escolha iterativa do próximo token
O sistema SHALL receber o contexto acumulado e retornar uma única etapa de geração contendo candidatos de próximo token e suas probabilidades. A pessoa SHALL poder escolher um dos candidatos apresentados, e o sistema SHALL acrescentar exatamente o token escolhido ao contexto daquele caminho antes de solicitar a etapa seguinte.

#### Scenario: Escolher o primeiro token
- **WHEN** a pessoa envia uma afirmação falsa e seleciona um candidato de próximo token
- **THEN** o sistema SHALL registrar a escolha como o primeiro nó após a afirmação e SHALL exibir os candidatos da etapa seguinte com base no contexto acrescido desse token

#### Scenario: Preservar espaço ou quebra de linha do token
- **WHEN** a pessoa escolhe um token que contém espaço, tabulação ou quebra de linha
- **THEN** o sistema SHALL acrescentar o valor original do token ao contexto e SHALL representá-lo de forma visível sem alterar seu valor

### Requirement: Árvore de caminhos de tokens
O sistema SHALL apresentar as escolhas de token em uma árvore enraizada na afirmação inicial. O caminho ativo SHALL ser visualmente identificado, e cada nó SHALL manter o token escolhido e sua probabilidade.

#### Scenario: Construir um caminho linear
- **WHEN** a pessoa seleciona tokens sucessivos a partir do último nó ativo
- **THEN** o sistema SHALL adicionar cada escolha como filho do nó anterior e SHALL atualizar o caminho ativo até o novo nó

#### Scenario: Criar uma ramificação
- **WHEN** a pessoa seleciona um nó já existente que não é a ponta do caminho e escolhe outro candidato de próximo token
- **THEN** o sistema SHALL preservar os filhos existentes, criar um novo ramo a partir desse nó e tornar o novo ramo o caminho ativo

### Requirement: Leitura do caminho construído
O sistema SHALL exibir o texto formado pela afirmação inicial e pelos tokens do caminho ativo, na ordem em que foram escolhidos. O sistema SHALL permitir finalizar a exploração sem classificar automaticamente o texto produzido como verdadeiro ou falso.

#### Scenario: Alternar o caminho ativo
- **WHEN** a pessoa seleciona um nó pertencente a outro ramo
- **THEN** o sistema SHALL atualizar o texto acumulado para refletir a sequência da raiz até o nó selecionado

#### Scenario: Finalizar exploração
- **WHEN** a pessoa encerra a exploração de um caminho
- **THEN** o sistema SHALL preservar a árvore e o texto construído e SHALL evitar apresentar uma conclusão factual automática
