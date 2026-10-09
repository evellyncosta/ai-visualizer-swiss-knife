## MODIFIED Requirements

### Requirement: Seleção de modo na página inicial
O sistema SHALL apresentar uma página inicial como ponto de entrada da aplicação, com opções claramente identificadas para `Visualizar token`, `Visualizar texto` e `Hallucination Path`.

#### Scenario: Abrir a aplicação
- **WHEN** o usuário acessa a página inicial
- **THEN** ele SHALL visualizar as três opções de modo antes de qualquer visualização de geração

#### Scenario: Escolher visualização de token
- **WHEN** o usuário seleciona `Visualizar token`
- **THEN** o sistema SHALL abrir a página do visualizador de token

#### Scenario: Escolher visualização de texto
- **WHEN** o usuário seleciona `Visualizar texto`
- **THEN** o sistema SHALL abrir a página do visualizador de texto

#### Scenario: Escolher Hallucination Path
- **WHEN** o usuário seleciona `Hallucination Path`
- **THEN** o sistema SHALL abrir a página da exploração iterativa de caminhos de token

#### Scenario: Escolher visualização de frase
- **WHEN** o usuário acessa a rota legada da visualização de frase
- **THEN** o sistema SHALL encaminhá-lo ao visualizador de texto

### Requirement: Retorno à página inicial
As páginas de visualização de token, de texto e de Hallucination Path SHALL oferecer uma forma visível de retornar à página inicial.

#### Scenario: Retornar de um modo
- **WHEN** o usuário seleciona a ação de retorno em qualquer página de modo
- **THEN** o sistema SHALL abrir a página inicial
