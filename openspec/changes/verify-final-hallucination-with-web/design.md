## Context

Veja `proposal.md` para a motivação. A geração do Hallucination Path usa
`gpt-5.4-nano`; a verificação atual reutiliza esse modelo em duas chamadas: uma
busca web e outra, sem reasoning configurado, que produz JSON. O cliente associa
a verificação ao nó ativo, o botão de finalizar a dispara e a árvore permanece
editável. A especificação já localiza a área de verificação abaixo da árvore,
mas o template atual a coloca no painel do caminho ativo.

## Goals / Non-Goals

**Goals:**

- Criar uma transição de finalização explícita, idempotente e imutável no
  navegador.
- Usar uma única execução avaliadora baseada em Responses API, com pesquisa web
  obrigatória e reasoning, para formar o veredito e suas evidências.
- Preservar um contrato de resposta validável e fontes disponíveis para a
  interface.

**Non-Goals:**

- Expor cadeia de pensamento do modelo; a interface mostra somente o motivo
  conciso do veredito e as fontes.
- Fazer verificação contínua durante geração, escolha de tokens ou finalização.
- Garantir verdade factual em casos sem evidência suficiente.

## Decisions

### Finalização e verificação são ações independentes

O estado do cliente terá uma marca `finalized` e um snapshot de premissa e
resposta. Finalizar definirá essa marca, congelará seleção, ramificação e
geração, e atualizará a interface; não chamará a API. Uma seção própria após a
árvore conterá o botão de verificar, habilitado somente quando existir snapshot
final. O botão controlará o estado de carregamento para prevenir solicitações
duplicadas.

Associar o botão a `Finalizar exploração` foi descartado porque contraria o
controle explícito solicitado e confunde congelamento com avaliação.

### Modelo avaliador com busca agentiva obrigatória

O gerador permanece em `gpt-5.4-nano`. O servidor definirá um modelo avaliador
separado, `gpt-5.5`, e fará uma única chamada Responses API com
`reasoning.effort="medium"`, `web_search` e `tool_choice="required"`. A entrada
incluirá a premissa e a resposta final como dados não confiáveis, instruindo o
avaliador a não seguir comandos contidos nelas e a analisar alegações do
assistant e a forma como ele tratou a premissa.

Usar o mesmo `gpt-5.4-nano`, ou permitir busca opcional, foi descartado porque
não satisfaz a independência do avaliador nem a consulta externa obrigatória.
Separar busca e julgamento em chamadas distintas também foi descartado: uma
execução agentiva permite que o avaliador refine a pesquisa enquanto raciocina
sobre a evidência e mantém o vínculo entre fontes e veredito.

### Mensagem textual e proveniência das fontes

O avaliador retornará sua mensagem textual normal. O servidor a encaminhará como
`message` e extrairá citações URL da resposta para anexá-las como `sources`.
Ausência de fontes ou evidência insuficiente não será convertida em um estado
determinístico; o prompt orientará o agente a explicar a limitação na mensagem.

sem inserir HTML retornado pelo modelo.
O cliente renderizará a mensagem e links usando texto seguro, sem inserir HTML
retornado pelo modelo.
sem inserir HTML retornado pelo modelo.

### Compatibilidade e falhas

`POST /api/verify-hallucination` conserva o payload de entrada `{prompt,
response, locale}` e devolve `{message, sources}`. Falhas de provedor permanecem
erros seguros; logs mantêm metadados da solicitação e nunca a premissa, a
resposta ou conteúdo de fontes.

## Risks / Trade-offs

- [Busca agentiva aumenta custo e latência] → a chamada ocorre apenas sob ação
  explícita após finalizar; usar `medium` limita a profundidade por padrão.
- [Fontes recuperadas podem ser fracas ou conflitantes] → instruir preferência
  por fontes primárias/autoridade e usar `inconclusive` quando não sustentarem o
  veredito.
- [O modelo avaliador não chama a ferramenta apesar da configuração] → exigir
  `tool_choice` e orientar uma resposta transparente sobre a falta de fontes.
- [O snapshot final pode divergir do ramo exibido] → armazenar e enviar o texto
  no momento da finalização, nunca reconstruí-lo de uma árvore posteriormente
  editável.

## Migration Plan

1. Introduzir o estado final e mover a seção de verificação para após a árvore.
2. Trocar a implementação do endpoint pelo avaliador Responses com busca e
   contrato estruturado, mantendo validação e tratamento seguro de erros.
3. Atualizar traduções, demonstração e testes de cliente e servidor.
4. Implantar como mudança sem migração de dados. Em rollback, restaurar a
   interface e o endpoint anteriores; caminhos vivem apenas no navegador e não
   exigem conversão persistida.
