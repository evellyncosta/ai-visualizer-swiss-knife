## Context

O Image Visualizer concentra sua interface em `templates/image-visualizer.html` e `static/image-visualizer.js`, e usa `POST /api/generate-image` como fronteira com o Hugging Face Inference Endpoint. Hoje o servidor cria um `InferenceClient`, chama `text_to_image(prompt)`, valida uma imagem PIL e devolve somente `image/png`. A captura altera o tipo de representação remota e de resposta da rota, mas não a configuração do endpoint, credenciais, navegação ou o handler Tiny-SD. Veja `proposal.md` para a motivação e a especificação delta para o contrato observável.

## Goals / Non-Goals

**Goals:**

- Ramificar explicitamente a requisição por opção de captura, mantendo o caminho PNG atual como padrão e compatível.
- Tratar a resposta de captura como conteúdo não confiável: validar seu esquema, limites e cada PNG Base64 antes de repassá-la ao browser.
- Manter o resultado final exibível e os frames com metadados no estado do cliente, sem criar um modelo de navegação prematuro.

**Non-Goals:**

- Modificar, versionar ou configurar o Tiny-SD e seu handler.
- Adicionar streaming, persistência, fila, paralelismo ou nova dependência.
- Criar controles, galeria ou animação para navegar, comparar ou baixar frames intermediários.
- Mudar o contrato da geração sem captura, incluindo sua resposta binária PNG.

## Decisions

### Um único endpoint da aplicação com dois formatos explícitos

`POST /api/generate-image` continuará sendo a única fronteira do browser. A entrada incluirá o prompt e uma opção de captura validada; quando ela estiver ausente ou falsa, o servidor seguirá o caminho existente e responderá PNG. Quando estiver verdadeira, exigirá `capture_every` inteiro positivo, fará a requisição JSON ao mesmo endpoint Hugging Face e devolverá o contrato de captura para o cliente.

Uma rota independente para captura foi descartada porque duplicaria autenticação, logging, limites, erros seguros e a configuração já isolada da integração de imagem. Unificar ambos como JSON no browser foi descartado para não romper o contrato binário convencional.

### Reutilizar a fronteira HTTP configurada e selecionar `Accept` por modo

A integração existente continuará usando `HF_IMAGE_ENDPOINT_URL`, `HF_TOKEN` e timeout configurado no servidor. O caminho convencional manterá a operação de imagem que pede `Accept: image/png`. O caminho de captura reutilizará a mesma fronteira autenticada para fazer `POST /` com corpo `{inputs, parameters}` e `Accept: application/json`; nenhuma URL, token ou parâmetro de endpoint será exposto ao navegador.

Forçar `capture_steps=true` com `Accept: image/png` foi descartado por não ser suportado pelo contrato Tiny-SD. Criar um segundo cliente/provedor ou enviar a URL ao browser foi descartado por aumentar a superfície de configuração e expor detalhes de servidor.

### Validar o envelope JSON completo antes de responder

O backend validará tipos e presença de `prompt`, `num_inference_steps`, `captured_steps` e `final_image_png_base64`; `num_inference_steps` será inteiro válido, e cada frame terá `step`, `timestep` e `png_base64` válidos. Cada valor Base64 será decodificado e verificado como PNG, aplicando limites equivalentes aos já usados para imagens e ao teto de 64 MiB do contrato de captura. A lista será mantida na ordem recebida, sem reordenar, deduplicar ou sintetizar etapas.

Confiar no JSON remotamente declarado ou normalizar/ordenar frames no backend foi descartado: ambos poderiam tornar a interface inconsistente com o Tiny-SD ou encaminhar dados inválidos. Uma resposta parcial também foi descartada, pois o endpoint só responde ao término e falhas acima do limite não possuem resultado utilizável.

### Estado de captura efêmero no cliente, sem navegação visual

O toggle permanecerá desligado até ação explícita. Ao ativá-lo, a página apresentará o campo `capture_every` com 10; ao desativá-lo, deixará de incluí-lo no payload. O cliente distinguirá a resposta Blob convencional da resposta JSON de captura, converterá somente a imagem final para a exibição e download atuais e manterá a coleção ordenada de frames e seus metadados em memória para uso posterior. Trocar de geração limpará URLs de objeto e o estado anterior.

Renderizar todos os frames, criar seletor/slider ou usar `data:` URLs diretamente foi descartado nesta mudança: aumenta memória e superfície visual sem atender à restrição de ainda não navegar entre frames.

### Erros, localização e observabilidade mantêm as convenções atuais

Validações locais e respostas inválidas usarão a rota de erro segura existente e o estado localizado de falha da página. Logs continuarão a conter identificador, duração, status e tipo de falha, nunca prompt, conteúdo Base64, endpoint ou token. Serão adicionadas chaves de localização somente para os novos rótulos e estados de captura, nos dois idiomas já suportados.

Repassar erros JSON do Tiny-SD sem saneamento foi descartado porque pode revelar informações de servidor ou conteúdo submetido.

## Risks / Trade-offs

- [A resposta JSON pode atingir o limite de 64 MiB ou consumir memória ao validar vários PNGs] -> recusar envelopes acima do limite e validar antes de materializar o resultado no cliente.
- [A API do cliente Hugging Face pode não expor diretamente todos os cabeçalhos necessários] -> usar a extensão HTTP já pertencente à integração configurada, coberta por teste mockado que verifica URL, método, corpo e `Accept`.
- [Frames Base64 malformados ou metadados inconsistentes podem parecer válidos superficialmente] -> validar Base64, assinatura/conteúdo PNG e tipos de cada campo antes da resposta.
- [Uma nova geração pode deixar blobs ou frames antigos na memória] -> revogar a URL de objeto anterior e limpar o estado de captura antes de mostrar o novo resultado.

## Migration Plan

1. Introduzir a validação de opções e os dois caminhos de negociação de conteúdo no endpoint existente, mantendo o caminho PNG como fallback sem migração de clientes.
2. Adicionar o toggle, campo condicional, traduções e estado efêmero ao Image Visualizer.
3. Executar testes de backend e cliente para PNG, captura JSON, erro e limpeza de estado; validar contra um Tiny-SD configurado em ambiente de teste.
4. Em rollback, remover o caminho de captura e os controles; clientes com a captura desligada permanecem compatíveis e não há dados persistidos a migrar.
