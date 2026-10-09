## 1. Tokenização alinhada ao modelo no servidor

- [x] 1.1 Declarar a dependência explícita do tokenizer oficial e verificar que a instalação do ambiente resolve as dependências sem erro.
- [x] 1.2 Centralizar o identificador do modelo usado pela geração e resolver, a partir dele, a codificação do tokenizer; verificar com teste que o contexto é codificado pelo modelo ativo e que um modelo desconhecido falha sem fallback silencioso.
- [x] 1.3 Criar registros de tokens do contexto com id e bytes serializáveis com segurança; verificar com testes que a sequência preserva a segmentação, espaços e bytes não decodificáveis isoladamente.

## 2. Contrato de geração e proteção dos dados de saída

- [x] 2.1 Estender a resposta de geração com `promptTokens`, mantendo `text` e `tokenProbs` compatíveis; verificar a resposta bem-sucedida em teste do endpoint.
- [x] 2.2 Propagar como erro seguro a falha de resolução do tokenizer e verificar que o endpoint não escolhe uma codificação alternativa.
- [x] 2.3 Manter os tokens, candidatos e probabilidades da palavra prevista provenientes dos logprobs do provedor; verificar em teste que a nova tokenização não altera esses registros de saída.

## 3. Visualização pedagógica da entrada e da saída

- [x] 3.1 Renderizar `promptTokens` antes dos tokens da palavra prevista, com estilo visual distinto e sem comportamento de seleção; verificar no navegador que apenas os tokens de saída controlam a tabela de probabilidades.
- [x] 3.2 Implementar rótulos seguros para bytes, espaços, quebras de linha e tabulações dos tokens do contexto; verificar com dados de demonstração que cada caso fica distinguível sem mudar o texto submetido.
- [x] 3.3 Atualizar as respostas de demonstração e os estados de carregamento/erro para o contrato estendido; verificar que a página inicial e uma geração real continuam renderizando corretamente.

## 4. Documentação e verificação integrada

- [x] 4.1 Atualizar a documentação para explicar que os tokens do contexto usam a codificação do modelo de geração e que a segmentação não inclui o envelope interno de mensagens; verificar a coerência com a configuração do servidor.
- [x] 4.2 Executar a suíte de testes do backend, a validação de sintaxe JavaScript e uma verificação manual com `o gato subiu no `; confirmar que contexto tokenizado, tokens de saída e tabela de probabilidades são exibidos sem expor configuração sensível.
