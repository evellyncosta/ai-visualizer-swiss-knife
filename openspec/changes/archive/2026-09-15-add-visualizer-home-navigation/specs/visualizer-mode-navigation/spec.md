## Purpose

Dar ao usuário uma entrada clara para os modos atuais e futuros do visualizador, sem confundir exemplos de demonstração com dados de uma geração em andamento.

## ADDED Requirements

### Requirement: Seleção de modo na página inicial
O sistema SHALL apresentar uma página inicial como ponto de entrada da aplicação, com opções claramente identificadas para `Visualizar token` e `Visualizar frase`.

#### Scenario: Abrir a aplicação
- **WHEN** o usuário acessa a página inicial
- **THEN** ele SHALL visualizar as duas opções de modo antes de qualquer visualização de geração

#### Scenario: Escolher visualização de token
- **WHEN** o usuário seleciona `Visualizar token`
- **THEN** o sistema SHALL abrir a página do visualizador de token

#### Scenario: Escolher visualização de frase
- **WHEN** o usuário seleciona `Visualizar frase`
- **THEN** o sistema SHALL abrir a página do visualizador de frase

### Requirement: Estado inicial vazio do visualizador de token
O visualizador de token SHALL abrir sem contexto submetido, resposta gerada, tokens exibidos ou tabela de probabilidades preenchida. Ele SHALL continuar permitindo que o usuário submeta um contexto para iniciar a geração.

#### Scenario: Abrir o visualizador de token
- **WHEN** o usuário chega à página de visualização de token pela página inicial
- **THEN** os campos e áreas de resultado SHALL estar vazios até que ele envie um contexto

### Requirement: Página de frase em construção
O visualizador de frase SHALL apresentar uma página dedicada com uma indicação inequívoca de que a funcionalidade está em construção. Essa página SHALL NOT simular uma geração ou uma análise de probabilidades.

#### Scenario: Abrir visualizador de frase indisponível
- **WHEN** o usuário abre a visualização de frase
- **THEN** o sistema SHALL informar que esse modo está em construção

### Requirement: Retorno à página inicial
As páginas de visualização de token e de frase SHALL oferecer uma forma visível de retornar à página inicial.

#### Scenario: Retornar de um modo
- **WHEN** o usuário seleciona a ação de retorno em qualquer página de modo
- **THEN** o sistema SHALL abrir a página inicial
