## Why

O Hallucination Path mistura hoje o encerramento da exploração com a verificação e permite que a mesma LLM de geração seja usada para avaliar seu próprio resultado. Isso não dá à pessoa controle explícito sobre o disparo, nem assegura uma avaliação fundamentada em fontes externas.

## What Changes

- Separar a finalização da exploração da solicitação de verificação: finalizar congela o caminho e nunca chama a API de verificação.
- Adicionar uma seção de verificação de alucinação abaixo da árvore de caminhos, com ação explicitamente acionada pela pessoa e indisponível até a finalização.
- Avaliar a premissa e a resposta final com um modelo diferente do gerador, usando reasoning e pesquisa web obrigatória em fontes externas.
- Devolver e exibir a mensagem textual livre do agente avaliador e as fontes consultadas, preservando o caminho finalizado em todos os resultados e falhas.

## Capabilities

### New Capabilities

- Nenhuma.

### Modified Capabilities

- `hallucination-path-visualization`: separar finalização e verificação manual e tornar a avaliação factual baseada em pesquisa web por um modelo distinto.

## Impact

- `templates/hallucination-path.html`, `static/hallucination-path.js`, `static/i18n.js` e estilos da página.
- Endpoint `POST /api/verify-hallucination`, contrato de verificação e prompt em `app.py` e `prompt_templates/verification.yaml`.
- Cliente OpenAI Responses API, com modelo avaliador configurado separadamente do modelo de geração e ferramenta `web_search` obrigatória.
- Testes Flask e de comportamento do cliente do Hallucination Path.
