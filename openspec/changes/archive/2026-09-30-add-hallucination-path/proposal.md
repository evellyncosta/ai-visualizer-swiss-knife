## Why

Os modos atuais mostram a geração de uma palavra ou de uma resposta completa, mas não permitem que a pessoa escolha cada continuação e enxergue como uma afirmação falsa pode sustentar um texto linguisticamente plausível. Um modo exploratório torna esse mecanismo visível, incluindo os caminhos alternativos que o modelo considerou em cada etapa.

## What Changes

- Adiciona o modo `Hallucination Path`, orientado a afirmações factuais falsas fornecidas pela pessoa usuária.
- Permite solicitar candidatos de próximo token, escolher um candidato por vez e construir iterativamente o contexto.
- Exibe as escolhas como uma árvore, preservando caminhos anteriores e permitindo ramificações a partir de nós já escolhidos.
- Expõe probabilidades dos candidatos e o texto correspondente ao caminho selecionado.
- Inclui um aviso de que o sistema não verifica automaticamente se a afirmação inicial é realmente falsa.
- Acrescenta o novo modo à navegação inicial da aplicação.

## Capabilities

### New Capabilities

- `hallucination-path-visualization`: exploração iterativa, orientada por uma afirmação falsa, de escolhas de próximo token em uma árvore de caminhos.

### Modified Capabilities

- `visualizer-mode-navigation`: incluir o modo Hallucination Path como uma opção de entrada na página inicial e como origem de retorno.

## Impact

- Novo template, JavaScript de interação e estilos para a árvore.
- Nova rota de página e extensão da API de geração para uma solicitação de próximo token por etapa.
- Textos localizados em português brasileiro e inglês.
- Testes de rota, validação de requisição e comportamento iterativo da API.
