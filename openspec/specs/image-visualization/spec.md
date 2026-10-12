# image-visualization Specification

## Purpose

Permitir gerar, visualizar e baixar no navegador uma imagem criada por um endpoint remoto de inferência configurado apenas no servidor.

## Requirements

### Requirement: Página isolada para visualização de imagem
O sistema SHALL oferecer uma página Image Visualizer separada dos visualizadores de texto, com um campo de prompt, uma ação de gerar, uma área de carregamento ou falha e uma área de resultado para a imagem. A página SHALL oferecer um botão toggle acessível para optar pela captura de denoising, inicialmente desativado. Quando a captura estiver ativa, SHALL disponibilizar a configuração `capture_every`, inicialmente preenchida com 10, e SHALL manter esse controle indisponível para a solicitação quando a captura estiver desativada.

#### Scenario: Abrir o Image Visualizer
- **WHEN** a pessoa abre a página Image Visualizer
- **THEN** o sistema SHALL apresentar o campo de prompt, o botão de captura inicialmente desativado e a ação para iniciar a geração sem exibir dados de outros visualizadores

#### Scenario: Enviar prompt válido
- **WHEN** a pessoa envia um prompt não vazio com a captura desativada
- **THEN** o navegador SHALL solicitar a geração de imagem ao endpoint de API dedicado sem parâmetros de captura

#### Scenario: Ativar e configurar captura
- **WHEN** a pessoa ativa a captura de denoising pelo botão toggle
- **THEN** o sistema SHALL permitir configurar um inteiro positivo `capture_every`, inicialmente com valor 10, e SHALL incluir a opção de captura na solicitação de geração

### Requirement: Geração remota segura de imagem
O sistema SHALL encaminhar um prompt válido a um endpoint remoto de inferência usando a integração HTTP configurada no ambiente do servidor e SHALL manter a URL remota e qualquer credencial fora do navegador e das respostas de erro. Sem captura, SHALL solicitar `image/png` e preservar a geração convencional. Com captura ativa, SHALL solicitar `application/json` e encaminhar `inputs` com `parameters.capture_steps` igual a `true` e `parameters.capture_every` como inteiro positivo.

#### Scenario: Endpoint remoto configurado
- **WHEN** uma solicitação válida de geração sem captura é recebida e a configuração remota está disponível
- **THEN** o sistema SHALL encaminhar o prompt ao endpoint remoto aceitando `image/png` e retornar o resultado de imagem ao navegador

#### Scenario: Endpoint remoto configurado com captura
- **WHEN** uma solicitação válida de geração com captura é recebida e a configuração remota está disponível
- **THEN** o sistema SHALL encaminhar o payload de captura ao mesmo endpoint remoto aceitando `application/json`

#### Scenario: Configuração remota ausente
- **WHEN** uma solicitação de geração é recebida sem a configuração necessária do endpoint remoto
- **THEN** o sistema SHALL retornar uma falha compreensível sem expor valores de configuração ou credenciais

#### Scenario: Falha do endpoint remoto
- **WHEN** o endpoint remoto recusa, expira ou devolve uma resposta inválida
- **THEN** o sistema SHALL informar o contrato de erro do Hugging Face (`error` e, quando presente, `code`), removendo URL remota, tokens de acesso, prompt e outros detalhes sensíveis

### Requirement: Resposta de imagem do endpoint de inferência
O sistema SHALL validar a resposta remota antes de disponibilizá-la ao navegador, sem persistir arquivos de imagem no servidor da aplicação. Para gerações sem captura, SHALL devolver a imagem PNG convencional. Para gerações com captura, SHALL desserializar e disponibilizar `prompt`, `num_inference_steps`, `captured_steps` e `final_image_png_base64`; SHALL preservar a ordem recebida e os metadados `step` e `timestep` de cada frame, e SHALL validar que a imagem final e cada `png_base64` são PNGs Base64 utilizáveis.

#### Scenario: Resposta de imagem válida sem captura
- **WHEN** o endpoint remoto devolve uma imagem PNG válida para uma solicitação sem captura
- **THEN** o navegador SHALL receber dados utilizáveis para exibir a imagem gerada pelo contrato PNG existente

#### Scenario: Resposta de captura válida
- **WHEN** o endpoint remoto devolve uma resposta JSON válida para uma solicitação com captura
- **THEN** o navegador SHALL receber a imagem final e os frames intermediários na mesma ordem e com os mesmos valores de `step` e `timestep` retornados pelo endpoint

#### Scenario: Payload de imagem ou captura inválido
- **WHEN** o endpoint remoto devolve uma imagem não decodificável, JSON sem os campos exigidos, Base64 inválido ou frame sem metadados válidos
- **THEN** o sistema SHALL rejeitar o resultado e informar uma falha segura ao navegador

### Requirement: Download no navegador
Após uma geração bem-sucedida, o sistema SHALL apresentar a imagem final e fornecer uma ação para a pessoa baixá-la no navegador com extensão PNG, sem enviar a imagem a um armazenamento do servidor. Quando a captura estiver ativa, o sistema SHALL renderizar os frames intermediários ordenados, com seus metadados `step` e `timestep`, e permitir que a pessoa selecione um frame para visualização ampliada. A imagem final SHALL permanecer claramente identificada e disponível para download.

#### Scenario: Baixar imagem exibida
- **WHEN** a pessoa seleciona a ação de baixar após uma geração convencional bem-sucedida
- **THEN** o navegador SHALL iniciar o download da mesma imagem exibida sem enviar a imagem a um armazenamento do servidor

#### Scenario: Resultado com captura disponível
- **WHEN** uma geração com captura é concluída com sucesso
- **THEN** o sistema SHALL exibir a imagem final, renderizar os frames e seus metadados na mesma ordem retornada e permitir visualizar ampliadamente o frame selecionado

#### Scenario: Selecionar etapa intermediária
- **WHEN** a pessoa seleciona uma miniatura de etapa de denoising
- **THEN** o sistema SHALL exibir a imagem correspondente como a visualização ampliada e manter a identificação da etapa selecionada
