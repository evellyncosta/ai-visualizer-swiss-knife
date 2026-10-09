## 1. Caminho finalizado e contrato de verificação

- [x] 1.1 Adicionar ao estado do Hallucination Path a finalização imutável e bloquear escolhas, ramificações e troca de ramo após finalizar, verificando em teste de cliente que o caminho preservado não muda.
- [x] 1.2 Criar o perfil de prompt, a chamada e a validação do resultado estruturado da LLM para a verificação manual, verificando no teste de contrato o envio separado da premissa e da resposta final e os resultados inválidos.

## 2. Interface de verificação posterior

- [x] 2.1 Adicionar abaixo da Árvore de caminhos a seção de verificação com ação desabilitada antes da finalização, verificando no navegador ou teste DOM sua posição e disponibilidade.
- [x] 2.2 Conectar o botão de verificação ao snapshot do caminho finalizado, exibindo carregamento, veredito e motivo sem alterar a árvore, verificando sucesso, falha e nova tentativa em teste de cliente.
- [x] 2.3 Atualizar chaves PT-BR e EN, estilos acessíveis e a demonstração estática para representar a seção e seu resultado, verificando a alternância de idioma e o fluxo sem API.

## 3. Verificação integrada

- [x] 3.1 Atualizar a suíte Flask e JavaScript para cobrir o fluxo completo de finalizar, verificar e preservar o caminho, executando `pytest` e os testes de cliente sem falhas.
- [x] 3.2 Executar `openspec validate add-final-hallucination-verdict --strict` e corrigir qualquer falha da mudança.
