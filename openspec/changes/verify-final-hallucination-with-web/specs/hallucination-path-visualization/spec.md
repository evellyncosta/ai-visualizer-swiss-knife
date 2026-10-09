## MODIFIED Requirements

### Requirement: Leitura do caminho construído
O sistema SHALL exibir a afirmação inicial e a resposta formada pelos tokens do
caminho ativo em áreas visuais separadas. A resposta SHALL conter somente os
tokens escolhidos, na ordem em que foram escolhidos, sem inserir, remover ou
normalizar espaços, tabulações, quebras de linha ou pontuação. O sistema SHALL
permitir finalizar a exploração sem classificar automaticamente o texto
produzido como verdadeiro ou falso. Ao finalizar, o sistema SHALL preservar e
impedir alterações na árvore, na afirmação inicial, na resposta construída e no
caminho ativo; a finalização SHALL NOT iniciar uma solicitação de verificação.

#### Scenario: Exibir a resposta separada da premissa
- **WHEN** a pessoa inicia ou percorre um caminho
- **THEN** o sistema SHALL manter a afirmação inicial visível separadamente da
  resposta do assistant e SHALL evitar concatenar visualmente ambas como uma
  única cadeia de texto

#### Scenario: Alternar o caminho ativo
- **WHEN** a pessoa seleciona um nó pertencente a outro ramo antes de finalizar
- **THEN** o sistema SHALL manter a afirmação inicial e SHALL atualizar somente
  a resposta para refletir os tokens da raiz até o nó selecionado

#### Scenario: Finalizar exploração
- **WHEN** a pessoa encerra a exploração de um caminho
- **THEN** o sistema SHALL preservar e congelar a árvore, a afirmação inicial,
  a resposta construída e o caminho ativo, SHALL evitar apresentar uma
  conclusão factual automática e SHALL NOT solicitar uma verificação

### Requirement: Verificação manual de alucinação concluída
O sistema SHALL apresentar uma seção de verificação de alucinação imediatamente
abaixo da Árvore de caminhos. A seção SHALL mostrar uma ação de verificação
desabilitada antes da finalização e habilitá-la somente após a pessoa finalizar
o caminho. Somente o acionamento explícito dessa ação SHALL enviar a afirmação
inicial e a resposta final imutável a um modelo avaliador distinto do modelo de
geração. O modelo avaliador SHALL usar reasoning e consultar fontes externas
por pesquisa web antes de devolver uma mensagem textual de avaliação e as fontes
consultadas. O sistema SHALL exibir a mensagem e fontes clicáveis sem modificar
o caminho finalizado, sem tentar classificar deterministicamente se houve
alucinação.

#### Scenario: Seção antes da finalização
- **WHEN** a exploração ainda não foi finalizada
- **THEN** o sistema SHALL mostrar a seção abaixo da Árvore de caminhos e SHALL
  manter a ação de verificação desabilitada

#### Scenario: Finalizar sem verificar
- **WHEN** a pessoa finaliza a exploração e não aciona a ação de verificação
- **THEN** o sistema SHALL congelar o caminho e SHALL NOT chamar o serviço de
  avaliação ou pesquisa externa

#### Scenario: Solicitar verificação após finalizar
- **WHEN** a pessoa finaliza a exploração e aciona a verificação manual
- **THEN** o sistema SHALL enviar a afirmação inicial e a resposta concluída ao
  modelo avaliador distinto, SHALL exigir pesquisa web com reasoning e SHALL
  exibir a mensagem textual e fontes devolvidas

#### Scenario: Evidência insuficiente
- **WHEN** a pesquisa externa não produz evidências suficientes para avaliar as
  alegações verificáveis da resposta
- **THEN** o sistema SHALL exibir uma mensagem que explique a limitação da
  evidência e SHALL evitar afirmar deterministicamente que houve ou não houve
  alucinação

#### Scenario: Falha ao verificar
- **WHEN** a solicitação de verificação falha ou devolve um resultado inválido
- **THEN** o sistema SHALL informar que não foi possível concluir a verificação
  e SHALL preservar o caminho finalizado sem alteração
