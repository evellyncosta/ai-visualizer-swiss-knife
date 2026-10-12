## 1. Controle e estrutura da interface

- [x] 1.1 Substituir o checkbox de captura por um botão toggle com estado `aria-pressed`, mantendo a configuração `capture_every` condicional, e verificar a operação por mouse e teclado.
- [x] 1.2 Adicionar a estrutura localizada para a galeria de etapas, a identificação da imagem final e os rótulos de `step` e `timestep`, verificando as traduções em português e inglês.

## 2. Renderização e ciclo de vida dos frames

- [x] 2.1 Converter os PNGs Base64 dos frames de captura em miniaturas ordenadas com seus metadados e verificar, no teste de cliente, que todas as imagens retornadas são renderizadas na ordem da resposta.
- [x] 2.2 Implementar a seleção de miniatura para atualizar a visualização ampliada e verificar que a seleção fica identificada, enquanto o download continua apontando para a imagem final.
- [x] 2.3 Limpar a galeria, o estado de seleção e todos os URLs temporários ao substituir resultados ou descarregar a página, verificando que não restam URLs de objeto não revogados.

## 3. Verificação de regressão

- [x] 3.1 Atualizar `test_image_visualizer.js` para cobrir toggle, geração convencional, geração com captura, renderização, seleção e limpeza, e verificar com `node test_image_visualizer.js`.
- [x] 3.2 Executar `python -m pytest` e confirmar que os contratos PNG e JSON de `POST /api/generate-image` permanecem inalterados.
