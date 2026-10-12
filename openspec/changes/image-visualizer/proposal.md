## Why

O aplicativo hoje visualiza apenas fluxos de texto. Um modo independente para gerar imagens a partir de prompts permite explorar um modelo de imagem hospedado pela equipe, sem alterar os módulos ou a integração OpenAI existentes.

## What Changes

- Adicionar o modo e a página `Image Visualizer`, com campo de prompt, geração, visualização do resultado e ação para baixar a imagem no navegador.
- Adicionar uma rota Flask isolada que usa `huggingface_hub.InferenceClient` para encaminhar o prompt ao endpoint remoto configurado no servidor.
- Consumir a imagem retornada diretamente pelo `InferenceClient`, validando-a e convertendo-a para uma resposta segura ao navegador sem persistir arquivos de imagem no servidor.
- Manter a URL e a credencial opcional do endpoint exclusivamente na configuração do servidor.
- Acrescentar uma entrada de navegação para o novo modo, sem mudar o comportamento, contratos ou configuração dos módulos existentes.

## Capabilities

### New Capabilities

- `image-visualization`: geração, visualização e download de uma imagem retornada por um endpoint remoto de inferência.

### Modified Capabilities

- `visualizer-mode-navigation`: disponibilizar o Image Visualizer como modo adicional na página inicial.

## Impact

- Novo template, JavaScript e estilos específicos do Image Visualizer; adição do card de navegação e das traduções correspondentes.
- Nova rota de página e API no Flask, isoladas das rotas de geração e verificação OpenAI, com a dependência `huggingface_hub` para a integração de imagem.
- Configurações de servidor para o endpoint remoto e seu token, quando exigido.
- Testes da resposta de imagem do `InferenceClient`, falhas seguras, visualização e download no navegador.
