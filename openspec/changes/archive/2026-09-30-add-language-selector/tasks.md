## 1. Preferência e interface localizada

- [x] 1.1 Adicionar o seletor acessível `Português`/`English` ao canto superior direito dos templates de página e verificar, em viewport de desktop e celular, que ele é visível, navegável por teclado e identifica a seleção ativa.
- [x] 1.2 Implementar o catálogo de traduções e a aplicação da localidade para textos de template, textos dinâmicos, atributos `lang` e demonstrações; verificar manualmente todas as páginas nos dois idiomas.
- [x] 1.3 Persistir a preferência válida no navegador e aplicar `pt-BR` quando ela estiver ausente ou inválida; verificar recarregamento, troca entre modos e armazenamento corrompido.

## 2. Geração orientada por idioma

- [x] 2.1 Enviar o identificador de idioma selecionado em cada solicitação de geração e verificar em testes de cliente que somente os dois valores permitidos são enviados.
- [x] 2.2 Normalizar o idioma no servidor e incorporá-lo aos perfis de geração sem alterar as regras de resposta de uma palavra, texto simples ou fidelidade de tokens; verificar com testes unitários para português, inglês e valor inválido.
- [x] 2.3 Garantir que erros e resultados mantenham o idioma ativo e não traduzam a resposta ou os tokens após a geração; verificar os fluxos de sucesso e falha em ambos os idiomas.

## 3. Site estático e validação

- [x] 3.1 Atualizar o gerador estático e os recursos necessários para que as páginas geradas ofereçam o seletor e a localização sem servidor; verificar a geração e abrir cada arquivo HTML nos dois idiomas.
- [x] 3.2 Executar a suíte Python, a validação de sintaxe JavaScript, a geração estática e `openspec validate --change add-language-selector --strict`; verificar que os testes existentes de token e texto continuam passando.
