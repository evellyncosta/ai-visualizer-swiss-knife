## Why

A aplicação apresenta toda a interface em português, o que limita seu uso por pessoas que preferem inglês. A seleção de idioma também deve orientar as respostas geradas para que a experiência permaneça coerente.

## What Changes

- Adicionar um seletor de idioma persistente, visível no canto superior direito de todas as páginas, com somente Português e English como opções.
- Traduzir a interface, textos dinâmicos, demonstração estática e atributos de idioma do documento entre português brasileiro e inglês.
- Fazer o idioma selecionado orientar o idioma das respostas geradas pelo modelo nos modos de visualização, sem alterar a fidelidade da sequência de tokens ou das probabilidades.
- Rejeitar valores de idioma não suportados e usar português como padrão seguro.

## Capabilities

### New Capabilities

- `language-localization`: Seleção persistente de português ou inglês que localiza a interface e orienta as respostas geradas.

### Modified Capabilities

- Nenhuma.

## Impact

- Afeta os templates Flask, os artefatos estáticos gerados, CSS, JavaScript de interface e demonstração, rotas de geração e testes.
- Não adiciona dependências externas nem expõe configuração ou credenciais do provedor ao navegador.
