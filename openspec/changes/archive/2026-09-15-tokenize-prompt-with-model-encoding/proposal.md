## Why

O visualizador já mostra os tokens devolvidos pelo provedor para a próxima palavra, mas o contexto digitado ainda aparece como texto contínuo. Isso deixa incompleta a demonstração de como o mesmo modelo segmenta tanto a entrada quanto a saída.

## What Changes

- Tokenizar o contexto enviado pelo usuário com a codificação oficial resolvida para o mesmo modelo configurado para gerar a resposta.
- Retornar uma representação estruturada e fiel dos tokens do contexto, além dos tokens de saída e suas probabilidades já existentes.
- Exibir os limites dos tokens do contexto no visualizador, de forma visualmente distinta dos tokens de saída selecionáveis.
- Manter os tokens de saída como fornecidos pela resposta da OpenAI; eles não serão substituídos por uma retokenização local.

## Capabilities

### New Capabilities

- `model-aligned-prompt-tokenization`: segmenta e apresenta o contexto do usuário com o tokenizer associado ao modelo de geração configurado.

### Modified Capabilities

- `next-word-token-visualization`: integra a visualização do contexto tokenizado à inspeção existente da palavra prevista, sem mudar a regra de prever uma única palavra.

## Impact

- Afeta o endpoint de geração Flask, a configuração compartilhada do modelo, a interface JavaScript/CSS e os testes de API e interface.
- Adiciona a dependência explícita do tokenizer oficial compatível com o modelo configurado.
- Não expõe chaves, endpoints ou configuração do provedor ao frontend.
