# visualizer-mode-navigation Specification

## Purpose

Dar ao usuário uma entrada clara para os modos atuais e futuros do visualizador, sem confundir exemplos de demonstração com dados de uma geração em andamento.

## Requirements

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

### Requirement: Estado inicial vazio do visualizador de token
O visualizador de token SHALL abrir sem contexto submetido, resposta gerada, tokens exibidos ou tabela de probabilidades preenchida. Ele SHALL continuar permitindo que o usuário submeta um contexto para iniciar a geração.

#### Scenario: Abrir o visualizador de token
- **WHEN** o usuário chega à página de visualização de token pela página inicial
- **THEN** os campos e áreas de resultado SHALL estar vazios até que ele envie um contexto

### Requirement: Página de texto
O visualizador de texto SHALL apresentar uma página dedicada para enviar perguntas ou instruções e visualizar respostas completas. Essa página SHALL NOT informar que o modo está em construção.

#### Scenario: Abrir visualizador de texto
- **WHEN** o usuário abre a visualização de texto
- **THEN** o sistema SHALL apresentar controles para enviar uma pergunta ou instrução

### Requirement: Retorno à página inicial
As páginas de visualização de token, de texto e de Hallucination Path SHALL oferecer uma forma visível de retornar à página inicial.

#### Scenario: Retornar de um modo
- **WHEN** o usuário seleciona a ação de retorno em qualquer página de modo
- **THEN** o sistema SHALL abrir a página inicial
