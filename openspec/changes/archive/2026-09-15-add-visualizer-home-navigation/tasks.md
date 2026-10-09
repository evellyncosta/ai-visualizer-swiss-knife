## 1. Rotas e páginas de modo

- [x] 1.1 Criar as rotas de início, visualização de token e visualização de frase; verificar com testes Flask que cada URL retorna a página esperada.
- [x] 1.2 Criar a página inicial com links identificáveis para `Visualizar token` e `Visualizar frase`; verificar que ambos apontam para seus modos.
- [x] 1.3 Criar a página de frase em construção e ações de retorno à página inicial nos dois modos; verificar o texto de indisponibilidade e os links de retorno.

## 2. Estado vazio do visualizador de token

- [x] 2.1 Mover o template atual do visualizador para a página de token e remover todos os valores e resultados preenchidos no HTML inicial; verificar que contexto, resposta, tokens e tabela começam vazios.
- [x] 2.2 Ajustar os scripts local e estático para não criar demonstrações automaticamente e para renderizar resultados somente após uma geração ou ação de demonstração explícita; verificar a sintaxe JavaScript e a geração após envio de contexto.

## 3. Estilo, distribuição estática e documentação

- [x] 3.1 Adicionar estilos responsivos para a seleção de modo, links de retorno e estado de frase em construção; verificar visualmente que as opções são distinguíveis e acessíveis.
- [x] 3.2 Atualizar o gerador estático para produzir as três páginas e preservar a navegação entre elas; verificar os arquivos gerados e os links relativos.
- [x] 3.3 Atualizar README e testes integrados; executar a suíte Python, a validação de sintaxe JavaScript e a validação OpenSpec para confirmar que a navegação não expõe credenciais nem altera `/api/generate`.
