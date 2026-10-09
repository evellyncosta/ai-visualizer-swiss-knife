# text-response-visualization Specification

## Purpose

Permitir que pessoas vejam como o modelo constrói uma resposta completa e útil, token a token, em resposta a uma pergunta ou instrução.

## Requirements

### Requirement: Geração de resposta em texto simples
O sistema SHALL aceitar uma pergunta ou instrução no modo de texto e gerar uma resposta completa em texto simples. A resposta SHALL permitir frases e parágrafos, e SHALL NOT conter Markdown.

#### Scenario: Responder a uma instrução
- **WHEN** o usuário submete `Escreva uma mensagem de aniversário para meu pai`
- **THEN** o sistema SHALL retornar uma resposta textual completa formada por tokens do provedor

#### Scenario: Resposta com parágrafos
- **WHEN** a resposta contém uma ou mais quebras de parágrafo
- **THEN** o sistema SHALL preservar essas quebras na resposta e em sua sequência de tokens

#### Scenario: Resposta com Markdown
- **WHEN** o provedor retorna conteúdo que usa formatação Markdown
- **THEN** o sistema SHALL retornar um erro seguro em vez de apresentar esse conteúdo como texto simples

### Requirement: Orientação de tamanho sem truncamento
O sistema SHALL instruir o modelo a produzir uma resposta de até 500 caracteres. Se a resposta ultrapassar essa orientação, o sistema SHALL preservar e exibir a resposta completa e seus tokens, sem truncar, mesclar ou descartar tokens.

#### Scenario: Resposta dentro da orientação
- **WHEN** o provedor retorna uma resposta com até 500 caracteres
- **THEN** o sistema SHALL apresentá-la integralmente com seus tokens e probabilidades

#### Scenario: Resposta acima da orientação
- **WHEN** o provedor retorna uma resposta com mais de 500 caracteres
- **THEN** o sistema SHALL apresentar a resposta e todos os tokens recebidos integralmente

### Requirement: Visualização fiel da construção de texto
O visualizador SHALL renderizar cada token selecionado da resposta como uma unidade selecionável, em ordem de geração. O visualizador SHALL tornar visíveis espaços, quebras de linha e quebras de parágrafo sem alterar os valores subjacentes da resposta.

#### Scenario: Selecionar token no meio da resposta
- **WHEN** o usuário seleciona um token posterior na resposta completa
- **THEN** a tabela SHALL mostrar os candidatos e probabilidades da etapa após a pergunta e todos os tokens anteriores da resposta

#### Scenario: Exibir quebra de parágrafo
- **WHEN** um token selecionado representa uma quebra de linha ou parágrafo
- **THEN** o visualizador SHALL indicar visualmente essa quebra e manter a estrutura de parágrafos da resposta

### Requirement: Perfil de geração isolado
O modo de texto SHALL usar um perfil de geração que permita respostas completas, sem alterar o perfil de uma única palavra do visualizador de token.

#### Scenario: Alternar entre modos
- **WHEN** o usuário gera uma resposta no modo de texto e depois abre o visualizador de token
- **THEN** o visualizador de token SHALL continuar solicitando e validando uma única palavra
