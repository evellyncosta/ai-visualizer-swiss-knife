## Purpose

Permitir gerar, visualizar e baixar no navegador uma imagem criada por um endpoint remoto de inferência configurado apenas no servidor.

## ADDED Requirements

### Requirement: Página isolada para visualização de imagem
O sistema SHALL oferecer uma página Image Visualizer separada dos visualizadores de texto, com um campo de prompt, uma ação de gerar, uma área de carregamento ou falha e uma área de resultado para a imagem.

#### Scenario: Abrir o Image Visualizer
- **WHEN** a pessoa abre a página Image Visualizer
- **THEN** o sistema SHALL apresentar o campo de prompt e o controle para iniciar a geração sem exibir dados de outros visualizadores

#### Scenario: Enviar prompt válido
- **WHEN** a pessoa envia um prompt não vazio
- **THEN** o navegador SHALL solicitar a geração de imagem ao endpoint de API dedicado

### Requirement: Geração remota segura de imagem
O sistema SHALL encaminhar um prompt válido a um endpoint remoto de inferência por meio de `huggingface_hub.InferenceClient`, configurado no ambiente do servidor, e SHALL manter a URL remota e qualquer credencial fora do navegador e das respostas de erro.

#### Scenario: Endpoint remoto configurado
- **WHEN** uma solicitação válida de geração é recebida e a configuração remota está disponível
- **THEN** o sistema SHALL usar `InferenceClient` para encaminhar o prompt ao endpoint remoto e retornar o resultado de imagem ao navegador

#### Scenario: Configuração remota ausente
- **WHEN** uma solicitação de geração é recebida sem a configuração necessária do endpoint remoto
- **THEN** o sistema SHALL retornar uma falha compreensível sem expor valores de configuração ou credenciais

#### Scenario: Falha do endpoint remoto
- **WHEN** o endpoint remoto recusa, expira ou devolve uma resposta inválida
- **THEN** o sistema SHALL informar uma falha compreensível sem expor a URL remota, tokens de acesso ou detalhes sensíveis do provedor

### Requirement: Resposta de imagem do InferenceClient
O sistema SHALL aceitar a imagem retornada por `InferenceClient.text_to_image`, SHALL validá-la e SHALL disponibilizar a imagem resultante ao navegador sem persistir o arquivo no servidor da aplicação.

#### Scenario: Resposta de imagem válida
- **WHEN** o `InferenceClient` devolve uma imagem válida
- **THEN** o navegador SHALL receber dados utilizáveis para exibir a imagem gerada

#### Scenario: Payload de imagem inválido
- **WHEN** o `InferenceClient` não devolve uma imagem decodificável
- **THEN** o sistema SHALL rejeitar o resultado e informar uma falha segura ao navegador

### Requirement: Download no navegador
Após uma geração bem-sucedida, o sistema SHALL apresentar a imagem e fornecer uma ação para a pessoa baixá-la no navegador com uma extensão compatível com seu tipo MIME.

#### Scenario: Baixar imagem exibida
- **WHEN** a pessoa seleciona a ação de baixar após uma geração bem-sucedida
- **THEN** o navegador SHALL iniciar o download da mesma imagem exibida sem enviar a imagem a um armazenamento do servidor
