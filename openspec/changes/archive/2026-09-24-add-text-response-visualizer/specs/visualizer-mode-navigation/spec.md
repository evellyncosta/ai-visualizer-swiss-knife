## MODIFIED Requirements

### Requirement: Seleção de modo na página inicial
O sistema SHALL apresentar uma página inicial como ponto de entrada da aplicação, com opções claramente identificadas para `Visualizar token` e `Visualizar texto`.

#### Scenario: Abrir a aplicação
- **WHEN** o usuário acessa a página inicial
- **THEN** ele SHALL visualizar as duas opções de modo antes de qualquer visualização de geração

#### Scenario: Escolher visualização de token
- **WHEN** o usuário seleciona `Visualizar token`
- **THEN** o sistema SHALL abrir a página do visualizador de token

#### Scenario: Escolher visualização de texto
- **WHEN** o usuário seleciona `Visualizar texto`
- **THEN** o sistema SHALL abrir a página do visualizador de texto

#### Scenario: Escolher visualização de frase
- **WHEN** o usuário acessa a rota legada da visualização de frase
- **THEN** o sistema SHALL encaminhá-lo ao visualizador de texto

### Requirement: Página de texto
O visualizador de texto SHALL apresentar uma página dedicada para enviar perguntas ou instruções e visualizar respostas completas. Essa página SHALL NOT informar que o modo está em construção.

#### Scenario: Abrir visualizador de texto
- **WHEN** o usuário abre a visualização de texto
- **THEN** o sistema SHALL apresentar controles para enviar uma pergunta ou instrução

### Requirement: Retorno à página inicial
As páginas de visualização de token e de texto SHALL oferecer uma forma visível de retornar à página inicial.

#### Scenario: Retornar de um modo
- **WHEN** o usuário seleciona a ação de retorno em qualquer página de modo
- **THEN** o sistema SHALL abrir a página inicial

## REMOVED Requirements

### Requirement: Página de frase em construção
**Reason**: O modo passa a oferecer um visualizador funcional de respostas completas em texto.
**Migration**: Usar o visualizador de texto; a rota legada de frase encaminha para ele.
