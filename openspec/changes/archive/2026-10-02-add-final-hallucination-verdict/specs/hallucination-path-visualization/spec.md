## ADDED Requirements

### Requirement: Verificação manual de alucinação concluída
O sistema SHALL apresentar uma seção de verificação de alucinação imediatamente
abaixo da Árvore de caminhos. A seção SHALL permanecer indisponível até que a
pessoa finalize a exploração. Após a finalização, a pessoa SHALL poder acionar
explicitamente uma verificação que envie a afirmação inicial e a resposta
concluída do caminho à LLM. O sistema SHALL exibir se houve alucinação e o
motivo retornado pela LLM, sem modificar o caminho finalizado.

#### Scenario: Seção antes da finalização
- **WHEN** a exploração ainda não foi finalizada
- **THEN** o sistema SHALL mostrar a seção abaixo da Árvore de caminhos e SHALL
  manter a ação de verificação indisponível

#### Scenario: Solicitar verificação após finalizar
- **WHEN** a pessoa finaliza a exploração e aciona a verificação manual
- **THEN** o sistema SHALL enviar a afirmação inicial e a resposta concluída à
  LLM e SHALL exibir se houve alucinação e o motivo devolvido

#### Scenario: Falha ao verificar
- **WHEN** a solicitação de verificação falha ou devolve um resultado inválido
- **THEN** o sistema SHALL informar que não foi possível concluir a verificação
  e SHALL preservar o caminho finalizado sem alteração

## MODIFIED Requirements

### Requirement: Leitura do caminho construído
O sistema SHALL exibir a afirmação inicial e a resposta formada pelos tokens do
caminho ativo em áreas visuais separadas. A resposta SHALL conter somente os
tokens escolhidos, na ordem em que foram escolhidos, sem inserir, remover ou
normalizar espaços, tabulações, quebras de linha ou pontuação. O sistema SHALL
permitir finalizar a exploração sem classificar automaticamente o texto produzido
como verdadeiro ou falso. Após a finalização, o sistema SHALL preservar e
impedir alterações na árvore, na afirmação inicial, na resposta construída e no
caminho ativo.

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
- **THEN** o sistema SHALL preservar e congelar a árvore, a afirmação inicial,
  a resposta construída e o caminho ativo, e SHALL evitar apresentar uma
  conclusão factual automática
