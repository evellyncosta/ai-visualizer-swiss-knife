## Context

Hoje a rota inicial renderiza diretamente o visualizador de token e o JavaScript cria uma demonstração preenchida ao carregar. A aplicação Flask também gera uma versão estática da mesma interface. Veja `proposal.md` para a motivação e a especificação desta mudança para o comportamento observável.

## Goals / Non-Goals

**Goals:**

- Separar a escolha de modo da experiência de geração de token.
- Fazer a rota do visualizador de token começar sem dados de demonstração.
- Manter uma rota e uma página próprias para o futuro visualizador de frase.
- Preservar a capacidade de gerar a versão estática com links que funcionem fora do Flask.

**Non-Goals:**

- Não implementar a análise de frase nem qualquer endpoint adicional.
- Não alterar o contrato de `/api/generate`, as credenciais ou a lógica de tokenizer.
- Não adicionar autenticação, persistência de escolhas ou seleção de modelo.

## Decisions

### Usar rotas e templates dedicados

O servidor terá uma rota inicial, uma rota para token e uma rota para frase, cada uma renderizando seu template. A página inicial usará links normais para os modos, em vez de trocar toda a tela no JavaScript. Isso produz URLs compartilháveis, mantém o estado do visualizador isolado e facilita substituir a página de frase futuramente.

Alternativa considerada: uma única página com painéis ocultos. Foi rejeitada porque manteria o visualizador inicializado em segundo plano e tornaria o estado vazio mais frágil.

### Não inicializar dados de demonstração no modo token

O JavaScript do modo token aguardará uma geração antes de montar tokens, contexto e tabela. Durante o carregamento, os elementos de resultado permanecerão vazios ou exibirão instruções neutras; exemplos estáticos também não devem preencher a tela inicial desse modo.

### Manter a página de frase como marcador explícito

A rota de frase renderizará somente um estado de "Em construção" e uma navegação de retorno. Não reutilizará o componente de token nem fará chamadas à API, evitando sugerir uma capacidade inexistente.

### Adaptar o gerador estático

O gerador produzirá as páginas necessárias e converterá os links para caminhos estáticos relativos. Isso mantém a entrada e as duas páginas navegáveis na publicação GitHub Pages.

## Risks / Trade-offs

- [Links do Flask não funcionarem no site estático] → gerar arquivos HTML correspondentes e testar os links relativos na saída estática.
- [Referências antigas à rota raiz do visualizador] → manter um caminho claro a partir da página inicial e atualizar documentação/links internos relevantes.
- [Usuário interpretar a página vazia como erro] → exibir instrução curta para inserir um contexto e gerar a primeira palavra.

## Migration Plan

1. Adicionar rotas e templates de início, token e frase.
2. Remover a inicialização de demonstração e criar o estado vazio do modo token.
3. Atualizar navegação, estilos, documentação e geração estática.
4. Testar as três rotas, a geração após o estado vazio e os arquivos estáticos.

O rollback restaura a rota inicial como visualizador de token; não há dados persistidos nem migração de API.
