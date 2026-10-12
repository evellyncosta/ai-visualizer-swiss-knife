## MODIFIED Requirements

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
