## 1. Contrato backend de captura

- [x] 1.1 Estender a validação de `POST /api/generate-image` para aceitar a opção de captura e exigir `capture_every` inteiro positivo somente quando ativada, verificando em testes Flask as entradas válidas, ausentes, booleanas, zero e não inteiras.
- [x] 1.2 Manter o fluxo convencional de imagem usando `Accept: image/png` e a resposta binária atual, verificando com cliente Hugging Face mockado que prompt, negociação de conteúdo e contrato PNG permanecem inalterados.
- [x] 1.3 Reutilizar a fronteira HTTP autenticada existente para enviar a solicitação de captura com `Accept: application/json`, `inputs`, `capture_steps: true` e `capture_every`, verificando em teste mockado método, URL, cabeçalhos e corpo.
- [x] 1.4 Desserializar e validar a resposta de captura, incluindo o envelope, tipos, Base64 PNG, metadados de cada frame e limite de tamanho, verificando respostas válidas, JSON malformado, campo ausente, PNG inválido e payload acima do limite.
- [x] 1.5 Devolver ao browser a resposta JSON de captura preservando ordem, `step` e `timestep`, e preservar erros seguros, correlação e logs sem prompt, Base64, endpoint ou token, verificando os contratos de sucesso e falha em testes Flask.

## 2. Interface do Image Visualizer

- [x] 2.1 Adicionar o toggle de captura inicialmente desligado e o campo localizado `capture_every` com valor inicial 10, exibido e habilitado somente quando a captura estiver ativa, verificando o template, as traduções PT-BR/EN e os estados no teste de cliente.
- [x] 2.2 Fazer o cliente enviar apenas `{prompt}` com captura desligada e enviar a opção de captura com `capture_every` válido quando ligada, verificando os dois corpos de requisição no teste JavaScript.
- [x] 2.3 Diferenciar a resposta PNG convencional da resposta JSON de captura, exibindo e permitindo baixar a imagem final em ambos os casos, verificando Blob/URL de objeto e o resultado Base64 convertido no teste de cliente.
- [x] 2.4 Manter os frames de captura e seus metadados ordenados no estado efêmero do cliente, limpar esse estado e URLs de objeto ao substituir o resultado e não criar controles de navegação, verificando retenção, ordem e limpeza no teste JavaScript.
- [x] 2.5 Exibir falhas localizadas para respostas de captura inválidas ou erros remotos e restaurar os controles após cada tentativa, verificando erro, carregamento e recuperação no teste de cliente.

## 3. Verificação integrada e documentação

- [x] 3.1 Atualizar a documentação do Image Visualizer com os dois contratos do endpoint Tiny-SD e a orientação de manter URL e token somente no servidor, verificando que não há credenciais ou URL de endpoint no JavaScript do browser.
- [x] 3.2 Executar `python -m pytest` e `node test_image_visualizer.js`, corrigindo regressões no fluxo PNG e cobrindo o fluxo JSON de captura.
- [x] 3.3 Executar `openspec validate integrate-denoising-capture --strict` e corrigir quaisquer falhas nos artefatos de proposta, design, especificação ou tarefas.
