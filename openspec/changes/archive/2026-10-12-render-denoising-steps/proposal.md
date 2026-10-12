## Why

Quando a captura de denoising está ativa, o Image Visualizer recebe frames intermediários válidos, mas apresenta apenas a imagem final. Isso torna invisível justamente o progresso de geração que a opção promete capturar e dificulta a inspeção do processo.

## What Changes

- Trocar o controle de captura de denoising de checkbox por um botão toggle acessível, inicialmente desativado.
- Renderizar as etapas intermediárias retornadas como uma sequência ordenada de miniaturas, com seus metadados `step` e `timestep`.
- Permitir escolher uma etapa para visualização ampliada e identificar claramente a imagem final.
- Preservar a geração PNG convencional, o download da imagem exibida e o contrato da API existente.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `image-visualization`: alterar a interface de captura para expor visualmente os frames intermediários e usar um botão toggle acessível.

## Impact

- `templates/image-visualizer.html`, `static/image-visualizer.js`, `static/style.css` e `static/i18n.js`.
- `test_image_visualizer.js` para cobrir o toggle, a galeria de frames e a seleção.
- Nenhuma alteração esperada em `POST /api/generate-image`, no provedor remoto ou em dependências.
