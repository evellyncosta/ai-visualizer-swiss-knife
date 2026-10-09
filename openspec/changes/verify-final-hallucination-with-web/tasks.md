## 1. Finalização e interface da verificação

- [x] 1.1 Adicionar ao estado do Hallucination Path um snapshot final imutável e fazer `Finalizar exploração` somente congelar árvore, ramo, premissa e resposta, verificando no teste de cliente que nenhuma chamada a `/api/verify-hallucination` ocorre nessa ação.
- [x] 1.2 Bloquear após a finalização as escolhas de token, geração de ramos e troca de ramo, verificando no teste de cliente que árvore e snapshot não mudam após finalizar.
- [x] 1.3 Mover ou criar a seção de verificação abaixo da Árvore de caminhos, com botão explicitamente rotulado e desabilitado antes da finalização, verificando template, localização PT-BR/EN e estado renderizado no teste de cliente.
- [x] 1.4 Habilitar o botão de verificação apenas quando o snapshot final existir e disparar a chamada somente em seu clique, verificando que o payload contém exatamente a premissa e resposta congeladas e que cliques durante carregamento não duplicam a solicitação.
- [x] 1.5 Renderizar com segurança a mensagem textual do agente e fontes clicáveis, incluindo estados de carregamento e falha sem descongelar o caminho, verificando cenários no teste de cliente e na demonstração estática.

## 2. Avaliação com fontes externas

- [x] 2.1 Configurar um identificador de modelo avaliador separado do modelo gerador e migrar a verificação para uma única chamada Responses API com `gpt-5.5`, `reasoning.effort` médio, `web_search` e escolha de ferramenta obrigatória, verificando os argumentos enviados com teste unitário mockado.
- [x] 2.2 Atualizar o prompt de avaliação para tratar premissa e resposta como dados não confiáveis e pedir uma mensagem factual cautelosa, sem classificação determinística, verificando a renderização dos perfis PT-BR e EN.
- [x] 2.3 Extrair citações e metadados de fontes da resposta do avaliador e encaminhar a mensagem textual com `sources`, verificando respostas com e sem fontes.
- [x] 2.4 Preservar o contrato HTTP, validação de entrada, correlação e logs sem conteúdo sensível; verificar respostas 400 e falhas do provedor em testes Flask.

## 3. Verificação integrada

- [x] 3.1 Executar `python -m pytest` e `node test_hallucination_path.js`, corrigindo regressões nos modos de geração existentes e no fluxo do Hallucination Path.
- [x] 3.2 Executar `openspec validate verify-final-hallucination-with-web --strict` e corrigir falhas de proposta, especificação, design ou tarefas.
