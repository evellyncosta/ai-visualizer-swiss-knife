## Why

Falhas de geração chegam ao cliente como HTTP 500 ou 502, mas o endpoint não registra a exceção nem um contexto que permita identificar a causa no ambiente de execução. Isso impede diagnosticar problemas de configuração, respostas incompatíveis do provedor e falhas inesperadas sem reproduzi-los.

## What Changes

- Registrar erros conhecidos e inesperados do endpoint de geração com nível, código de causa seguro, tipo de exceção, traceback quando aplicável e contexto operacional seguro.
- Criar e propagar um identificador de requisição para correlacionar a resposta de erro com a entrada correspondente no log.
- Registrar o desfecho e a duração das solicitações de geração, sem registrar prompts, credenciais, cabeçalhos de autenticação ou corpos brutos do provedor.
- Manter os códigos HTTP e o contrato de erro público existentes, salvo uma adição compatível do identificador de correlação no cabeçalho da resposta.

## Capabilities

### New Capabilities

- `generation-error-observability`: Registro seguro e correlacionável do ciclo de vida e das falhas de solicitações de geração.

### Modified Capabilities

- Nenhuma.

## Impact

- Afeta `app.py`, especialmente o endpoint `POST /api/generate` e a configuração de logging da aplicação Flask.
- Afeta os testes de rota para verificar registros, códigos seguros de causa, níveis, ausência de dados sensíveis e o cabeçalho de correlação.
- Não adiciona dependências externas nem altera o payload JSON de sucesso ou erro.
