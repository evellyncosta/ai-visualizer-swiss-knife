## Why

O modo de frase atual é apenas um marcador de funcionalidade futura, enquanto o visualizador já possui a base para ensinar probabilidades em cada token de uma saída. Transformá-lo em um visualizador de respostas completas permite explorar como o modelo constrói texto útil a partir de perguntas e instruções.

## What Changes

- Substituir o modo e a página `Visualizar frase` por `Visualizar texto`.
- Permitir que o usuário envie uma pergunta ou instrução e receba uma resposta completa em texto simples, potencialmente com múltiplos parágrafos.
- Tornar cada token da resposta selecionável e exibir suas alternativas e probabilidades no contexto de geração correspondente.
- Instruir o modelo a evitar Markdown e a buscar respostas de até 500 caracteres, sem truncar ou rejeitar uma resposta que exceda essa orientação.
- Manter o visualizador de token, que continua prevendo uma única palavra, inalterado em seu comportamento.

## Capabilities

### New Capabilities

- `text-response-visualization`: gera e explica uma resposta completa em texto simples, token a token, a partir de uma pergunta ou instrução.

### Modified Capabilities

- `visualizer-mode-navigation`: renomeia a entrada de frase para texto e conecta a seleção de modo ao novo visualizador funcional.

## Impact

- Afeta a rota, template e scripts do modo de texto, o contrato de geração entre frontend e backend, os prompts de sistema, a validação da resposta e os testes.
- Não expõe credenciais nem configuração do provedor ao frontend.
