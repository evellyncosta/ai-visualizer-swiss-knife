## Why

O Hallucination Path atualmente cria uma resposta nova do modelo para cada token
escolhido. Como o provedor é um modelo de chat, essas chamadas independentes não
representam uma única continuação e podem reiniciar padrões, perder coerência e
produzir repetições artificiais. O modo deve visualizar uma geração contínua,
mantendo a exploração de alternativas por ramificações sob demanda.

## What Changes

- Gerar vários tokens contínuos em cada solicitação inicial ou de ramificação do
  modo `path`, mantendo logprobs e top_logprobs por token.
- Revelar no navegador os tokens já recebidos, um passo por vez, sem nova
  chamada quando a pessoa segue o token originalmente gerado.
- Criar uma nova geração contínua somente quando a pessoa escolher uma
  alternativa ao token originalmente gerado em uma etapa.
- Usar a premissa original, acrescida do prefixo escolhido apenas em uma
  ramificação, como contexto de entrada para uma nova sequência contínua.
- Preservar a árvore, as probabilidades, os espaços e a pontuação exatos dos
  tokens em cada caminho.
- Atualizar a demonstração estática e os testes para o contrato de sequência.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `hallucination-path-visualization`: substituir a geração independente de um
  token por etapa por sequências contínuas reveladas localmente e ramificadas
  apenas após uma escolha alternativa.

## Impact

- `prompt_templates/path.yaml` e o perfil de geração `path`.
- Validação e montagem de mensagens do modo `path` em `app.py` e o contrato de
  `/api/generate` para esse modo.
- Estado, requisições e renderização em `static/hallucination-path.js`.
- Demonstração estática gerada, textos de interface se necessários e testes de
  backend e frontend.
