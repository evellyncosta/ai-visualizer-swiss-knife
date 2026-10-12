## Context

O projeto Flask possui módulos de texto que dependem de OpenAI. O Image Visualizer é uma integração nova e não deve compartilhar cliente, configuração, rota de geração ou estado de interface com esses módulos. Veja `proposal.md` para a motivação e as especificações delta para o contrato observável.

## Goals / Non-Goals

**Goals:**

- Isolar a comunicação com o endpoint remoto de imagem em uma rota e configurações próprias.
- Preservar as credenciais do provedor no servidor.
- Exibir e baixar no navegador a mesma imagem de uma única geração sem criar arquivos persistentes no Flask.

**Non-Goals:**

- Alterar ou substituir integrações, configurações ou telas OpenAI existentes.
- Orquestrar, criar, pausar ou configurar o Hugging Face Inference Endpoint.
- Persistir imagens, histórico de prompts, galeria, filas ou execução assíncrona.
- Oferecer edição de imagens, múltiplas imagens, parâmetros de inferência ou seleção de modelo na primeira versão.

## Decisions

### Módulo Flask e interface isolados

Uma página, JavaScript e endpoint de API próprios serão adicionados para Image Visualizer. A página inicial receberá somente um card de navegação adicional; as rotas e o fluxo dos modos atuais não serão alterados.

Essa separação evita acoplamento com semânticas de probabilidades e tokens dos visualizadores de texto. Reaproveitar `/api/generate` foi descartado porque misturaria configurações de provedores, formatos de resposta e tratamento de falhas sem benefício para o novo fluxo.

### Chamada do Flask com Hugging Face InferenceClient

O Flask criará um `huggingface_hub.InferenceClient` por solicitação com `HF_IMAGE_ENDPOINT_URL` como URL do modelo/endpoint e `HF_TOKEN` como token opcional. O cliente chamará `text_to_image(prompt)` diretamente, sem expor URL ou credenciais ao navegador. O Flask não precisa conhecer o modelo implantado ou o mecanismo interno do endpoint.

Uma chamada HTTP manual foi descartada para usar o cliente oficial do Hugging Face, que centraliza autenticação, timeout e compatibilidade com o Inference Endpoint.

### Resposta de imagem do InferenceClient e transferência efêmera ao browser

O `InferenceClient` retornará uma imagem PIL. O Flask a serializará como PNG, validará tamanho e conteúdo antes de responder ao navegador. A resposta ao browser será binária `image/png`, e o JavaScript a lerá como `Blob`, criando uma URL de objeto temporária para exibição e download.

URLs assinadas e armazenamento de objetos foram descartados desta fase porque introduzem permissões, CORS, expiração e política de retenção. A imagem binária não é persistida e é transferida diretamente ao browser para manter o download nativo via `Blob`.

### Falhas e limites seguros

Prompts vazios serão rejeitados antes da chamada remota. Configuração ausente, timeout, exceções do `InferenceClient` e payload inválido serão mapeados a mensagens seguras. Logs conterão apenas metadados de diagnóstico aprovados, nunca prompt, Base64, URL interna ou token.

## Risks / Trade-offs

- [A serialização da imagem aumenta o tráfego entre o endpoint e Flask] -> Limitar o tamanho aceito da resposta e manter uma imagem por solicitação.
- [Endpoint de GPU pode sofrer cold start ou timeout] -> Usar timeout explícito e estado de carregamento/falha na interface.
- [MIME declarado não corresponde aos bytes] -> Verificar bytes decodificados antes de devolvê-los ao navegador.
- [URL de objeto permanece viva além da troca de resultado] -> Revogá-la ao substituir ou descartar a imagem na página.
- [Endpoint remoto devolve conteúdo de imagem inválido] -> Cobrir a validação e serialização da imagem com testes de integração simulados antes da ativação.

## Migration Plan

1. Configurar a URL remota e o token opcional apenas no ambiente do Flask.
2. Publicar a rota e a página Image Visualizer com o card de navegação.
3. Validar uma geração real, a visualização e o download em navegador.
4. Em caso de falha, remover o card e a rota do novo módulo; os modos OpenAI não exigem migração nem rollback.
