# model-aligned-prompt-tokenization Specification

## Purpose

Permitir que o visualizador revele como o tokenizer do modelo de geração segmenta o contexto enviado pelo usuário antes de prever a próxima palavra.

## Requirements

### Requirement: Tokenização do contexto alinhada ao modelo de geração
O sistema SHALL tokenizar cada contexto submetido com a codificação oficial resolvida para o mesmo identificador de modelo configurado para gerar a previsão. O sistema SHALL usar uma única configuração de identificador de modelo para as duas operações e SHALL retornar os tokens do contexto em ordem, com sua identidade de tokenizer e uma representação fiel para exibição.

#### Scenario: Contexto tokenizado com o modelo ativo
- **WHEN** o usuário submete o contexto `o gato subiu no `
- **THEN** a resposta de geração SHALL incluir os tokens ordenados que a codificação do modelo ativo produz para esse contexto

#### Scenario: Modelo sem codificação conhecida
- **WHEN** não for possível resolver uma codificação oficial para o modelo configurado
- **THEN** o sistema SHALL retornar um erro seguro de configuração ou geração e SHALL NOT escolher silenciosamente uma codificação de outro modelo

### Requirement: Representação fiel de tokens do contexto
O sistema SHALL preservar a identidade e a sequência de cada token do contexto, inclusive quando um token contiver espaço em branco, caracteres de controle ou bytes que não possam ser mostrados isoladamente como texto UTF-8. A representação para a interface SHALL tornar esses casos distinguíveis sem alterar o contexto original.

#### Scenario: Espaço visível no contexto
- **WHEN** um token do contexto contém um espaço, quebra de linha ou tabulação
- **THEN** a interface SHALL apresentar uma indicação visível desse caractere no respectivo token

#### Scenario: Token com bytes UTF-8 incompletos
- **WHEN** um único token não puder ser decodificado isoladamente como UTF-8 válido
- **THEN** a interface SHALL apresentar uma representação segura desse token sem substituir, omitir ou mesclar sua identidade

### Requirement: Separação entre tokens de entrada e saída
O visualizador SHALL mostrar os tokens do contexto em sua ordem original como unidades distintas dos tokens selecionáveis da palavra prevista. Os tokens do contexto SHALL NOT ser apresentados como candidatos da tabela de probabilidades nem como tokens de saída.

#### Scenario: Inspeção da construção da previsão
- **WHEN** uma geração válida contém tokens de contexto e uma palavra prevista dividida em tokens
- **THEN** o visualizador SHALL distinguir visualmente as unidades do contexto das unidades selecionáveis que constroem a palavra prevista
