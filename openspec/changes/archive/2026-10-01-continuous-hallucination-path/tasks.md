## 1. Geração contínua do caminho

- [x] 1.1 Atualizar o perfil `path` para solicitar uma continuação curta de no máximo 30 tokens e verificar, em teste, o limite configurado para o modelo.
- [x] 1.2 Adaptar a geração e a validação do modo `path` para devolver uma sequência fiel e não vazia de tokens com logprobs, verificando testes de respostas válidas e inconsistentes.
- [x] 1.3 Enviar a premissa, acrescida do prefixo escolhido somente em ramificações, como contexto `user` em toda solicitação `path`, verificando em teste as mensagens enviadas ao modelo.

## 2. Navegação de sequências e ramos

- [x] 2.1 Modelar no cliente os segmentos pré-gerados e o cursor de cada caminho, verificando que escolher o token original revela localmente a etapa seguinte sem uma nova requisição.
- [x] 2.2 Criar uma nova sequência somente para uma escolha alternativa e preservar a árvore existente, verificando os contextos e as chamadas de rede em teste de cliente.
- [x] 2.3 Exibir a premissa e a resposta do assistant em áreas separadas, indicar o fim de uma sequência sem solicitar nova geração e verificar que a interface preserva a árvore completa.
- [x] 2.4 Manter a exibição fiel de espaços, tabulações, quebras de linha, pontuação, token selecionado e alternativas na área de resposta, verificando cenários com tokens não lexicais.

## 3. Demonstração e verificação integrada

- [x] 3.1 Atualizar a demonstração estática do Hallucination Path para expor a premissa separada, uma sequência de múltiplas etapas e uma ramificação simulada, verificando a navegação sem API.
- [x] 3.2 Atualizar os testes de cliente e contrato para verificar o contexto acumulado de ramificações e a ausência de chamadas ao seguir tokens, verificando a suíte completa com `pytest`.
- [x] 3.3 Executar validação OpenSpec estrita e a suíte de testes, corrigindo falhas relacionadas à mudança.
