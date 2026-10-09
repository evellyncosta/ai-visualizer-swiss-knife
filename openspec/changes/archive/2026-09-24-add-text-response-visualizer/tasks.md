## 1. Perfil de geração de texto

- [x] 1.1 Adicionar um perfil de geração `text` ao endpoint existente, preservando o perfil padrão de uma única palavra; verificar com testes que cada perfil usa seus próprios prompt, limite de tokens e validação.
- [x] 1.2 Instruir o perfil de texto a responder sem Markdown, com parágrafos permitidos e alvo de até 500 caracteres; verificar em teste que a instrução é enviada ao modelo.
- [x] 1.3 Validar a concatenação fiel de tokens e rejeitar Markdown sem alterar a resposta; verificar com testes para Markdown, pontuação e quebras de parágrafo válidas.
- [x] 1.4 Preservar respostas acima de 500 caracteres sem truncamento; verificar com teste que texto e tokens completos permanecem no payload.

## 2. Página e navegação do visualizador de texto

- [x] 2.1 Renomear a opção e a rota de `Visualizar frase` para `Visualizar texto`, preservando a rota legada como encaminhamento; verificar que a página inicial e a navegação estática apontam ao novo modo.
- [x] 2.2 Substituir o marcador de construção por controles de pergunta/instrução e uma área de resposta inicialmente vazia; verificar que a tela de texto não apresenta dados de demonstração.
- [x] 2.3 Adaptar o script do modo de texto para enviar o perfil `text`, renderizar todos os tokens selecionáveis e mostrar a tabela por etapa; verificar que o contexto inclui a instrução e os tokens anteriores.
- [x] 2.4 Renderizar preservando parágrafos e indicadores visíveis de quebra de linha; verificar manualmente uma resposta com dois parágrafos e a seleção de um token de quebra.

## 3. Distribuição e verificação

- [x] 3.1 Atualizar o gerador estático, a demonstração estática e a documentação para o modo `Visualizar texto`; verificar que as páginas e links gerados funcionam sem configuração do provedor no navegador.
- [x] 3.2 Executar a suíte de testes Python, validação de sintaxe JavaScript, geração estática e validação OpenSpec; verificar que o modo token continua limitado a uma palavra e que o modo texto preserva resposta, tokens e probabilidades.
