## 1. Geração de próximo token

- [x] 1.1 Adicionar o modo `path` aos perfis, validações e mensagens de erro da API para gerar exatamente uma etapa de token, verificando com testes de `app.py` que os modos `word` e `text` permanecem compatíveis.
- [x] 1.2 Ajustar o endpoint de geração para aceitar e responder à solicitação do modo `path` com candidatos e probabilidades, verificando cenários de sucesso, modo inválido e resposta de múltiplos tokens em `pytest`.

## 2. Página e navegação

- [x] 2.1 Criar a rota e o template de Hallucination Path com orientação para afirmação falsa, aviso de ausência de fact-checking e retorno ao início, verificando a resposta HTTP da rota com testes Flask.
- [x] 2.2 Adicionar Hallucination Path como terceiro cartão da página inicial e atualizar todas as chaves de localização PT-BR e EN necessárias, verificando os dois idiomas no navegador.

## 3. Exploração em árvore no cliente

- [x] 3.1 Implementar o estado local de raiz, nós, filhos, caminho ativo e contexto acumulado, verificando que uma escolha de candidato cria um filho e preserva o token original, inclusive espaço ou quebra de linha.
- [x] 3.2 Implementar a solicitação de candidatos por etapa, estados de carregamento e tratamento de falha, verificando manualmente que cada clique envia o contexto do caminho ativo e mostra a próxima lista de escolhas.
- [x] 3.3 Renderizar uma árvore acessível com nós selecionáveis, caminho ativo destacado, probabilidades e texto acumulado, verificando manualmente a criação de um ramo a partir de um nó anterior sem perder o ramo original.
- [x] 3.4 Adicionar os estilos responsivos do novo módulo e os indicadores visuais para tokens especiais, verificando a leitura e a interação em viewport de desktop e mobile.

## 4. Verificação integrada

- [x] 4.1 Executar `pytest -q` e corrigir regressões nos modos Token e Texto.
- [x] 4.2 Gerar a saída estática pelo fluxo existente e verificar que a página inicial, os três modos e os assets do novo módulo são publicados corretamente.
