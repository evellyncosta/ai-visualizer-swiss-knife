## Why

O Image Visualizer hoje recebe somente a imagem final do Tiny-SD, tornando o processo de denoising opaco para quem explora a geração. O endpoint já oferece uma captura opcional de etapas intermediárias, que a aplicação precisa consumir sem alterar o fluxo PNG existente.

## What Changes

- Adicionar ao Image Visualizer um toggle de captura de denoising, desativado por padrão, e a configuração condicional de `capture_every`, inicialmente igual a 10.
- Preservar a geração convencional: quando a captura estiver desativada, a aplicação continuará solicitando e devolvendo a imagem PNG final como faz hoje.
- Encaminhar gerações com captura ao mesmo Hugging Face Inference Endpoint usando `Accept: application/json` e o payload `capture_steps: true` com `capture_every` positivo.
- Validar e desserializar a resposta de captura do Tiny-SD, incluindo prompt, total de etapas, frames intermediários ordenados com seus metadados e a imagem final em Base64.
- Disponibilizar no frontend o resultado final e os frames intermediários recebidos, sem implementar navegação visual, streaming, persistência ou concorrência.

## Capabilities

### New Capabilities

- Nenhuma.

### Modified Capabilities

- `image-visualization`: ampliar a geração remota e a página isolada para oferecer captura opt-in de etapas de denoising e consumir o contrato JSON do Tiny-SD, preservando a resposta PNG convencional.

## Impact

- `app.py`: contrato de `POST /api/generate-image`, chamada HTTP ao endpoint Hugging Face, validação e resposta segura de geração com captura.
- `templates/image-visualizer.html`, `static/image-visualizer.js`, `static/style.css` e `static/i18n.js`: controles localizados de captura e disponibilidade dos resultados retornados.
- `test_app.py` e `test_image_visualizer.js`: cenários dos contratos PNG e JSON, validação e estado da interface.
- Nenhuma alteração no handler Tiny-SD, na configuração de credenciais do servidor ou em dependências externas.
