# language-localization Specification

## Purpose

Permitir que pessoas usem o visualizador em português ou inglês, mantendo a interface e as respostas geradas no mesmo idioma selecionado.

## Requirements

### Requirement: Seletor de idioma disponível
O sistema SHALL apresentar em cada página do visualizador um controle visível no canto superior direito para selecionar somente `Português` ou `English`.

#### Scenario: Abrir qualquer página do visualizador
- **WHEN** a pessoa acessa a página inicial, o visualizador de token ou o visualizador de texto
- **THEN** ela SHALL encontrar o controle de idioma com as opções Português e English

#### Scenario: Navegar com o teclado
- **WHEN** a pessoa navega até o controle de idioma usando o teclado
- **THEN** ela SHALL conseguir identificar a opção ativa e selecionar a outra opção sem usar um dispositivo apontador

### Requirement: Interface localizada e preferência persistente
O sistema SHALL iniciar em português brasileiro quando não houver preferência válida e SHALL apresentar os textos da interface, atributos de idioma do documento e demonstrações no idioma selecionado. A seleção SHALL persistir quando a pessoa navega ou recarrega a aplicação no mesmo navegador.

#### Scenario: Selecionar inglês
- **WHEN** a pessoa seleciona English
- **THEN** os rótulos, instruções, controles, mensagens e demonstrações SHALL ser apresentados em inglês, e o documento SHALL declarar inglês como seu idioma

#### Scenario: Retornar à aplicação
- **WHEN** a pessoa que selecionou Português ou English recarrega uma página ou abre outro modo no mesmo navegador
- **THEN** o sistema SHALL restaurar a preferência selecionada

#### Scenario: Abrir sem preferência
- **WHEN** não existe uma preferência de idioma armazenada
- **THEN** o sistema SHALL apresentar a aplicação em português brasileiro

### Requirement: Conjunto de idiomas seguro
O sistema SHALL aceitar somente os identificadores de português brasileiro e inglês como preferência ou parâmetro de idioma. Valores ausentes, inválidos ou não reconhecidos SHALL usar português brasileiro sem impedir o uso do visualizador.

#### Scenario: Receber idioma inválido
- **WHEN** o cliente informa um identificador de idioma fora do conjunto suportado em uma solicitação de geração
- **THEN** o sistema SHALL tratar a solicitação como português brasileiro e SHALL NOT usar o valor inválido para instruir o provedor

### Requirement: Idioma da resposta gerada
O sistema SHALL incluir o idioma selecionado e válido na instrução de geração, para que a resposta do modelo seja produzida em português quando Português estiver ativo e em inglês quando English estiver ativo. Essa instrução SHALL preservar as restrições existentes de cada modo e a correspondência fiel entre resposta e tokens retornados.

#### Scenario: Gerar texto em inglês
- **WHEN** a pessoa seleciona English e envia uma pergunta no visualizador de texto
- **THEN** o sistema SHALL solicitar ao modelo uma resposta em inglês e SHALL exibir a resposta e seus tokens sem tradução posterior

#### Scenario: Gerar texto em português
- **WHEN** a pessoa seleciona Português e envia uma pergunta no visualizador de texto
- **THEN** o sistema SHALL solicitar ao modelo uma resposta em português e SHALL exibir a resposta e seus tokens sem tradução posterior

