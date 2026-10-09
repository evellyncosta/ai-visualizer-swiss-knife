## Why

A aplicação abre diretamente no visualizador de tokens e apresenta exemplos preenchidos, o que dificulta escolher o tipo de demonstração desejado. Uma entrada inicial deixa claro que há duas experiências previstas e prepara o caminho para o visualizador de frases.

## What Changes

- Adicionar uma página inicial com duas opções: `Visualizar token` e `Visualizar frase`.
- Mover o visualizador de token existente para uma página própria, aberta sem contexto, resposta ou tabela de probabilidades preenchidos.
- Adicionar uma página de visualização de frase com indicação clara de que está em construção.
- Disponibilizar navegação para retornar à página inicial a partir das páginas de cada modo.

## Capabilities

### New Capabilities

- `visualizer-mode-navigation`: permite selecionar um modo de visualização e navegar entre a página inicial, o visualizador de token e o estado de frase em construção.

### Modified Capabilities

- Nenhuma.

## Impact

- Afeta rotas e templates Flask, JavaScript de inicialização, estilos e a geração estática para GitHub Pages.
- Não altera o endpoint de geração, o modelo configurado, o tokenizer nem a configuração de credenciais.
