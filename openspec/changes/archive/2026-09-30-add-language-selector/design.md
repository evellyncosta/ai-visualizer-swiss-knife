## Context

As páginas Flask, os artefatos HTML estáticos e os textos criados em JavaScript têm conteúdo literal majoritariamente em português. A aplicação já possui dois perfis de geração no servidor e uma geração estática que reutiliza os templates.

## Goals / Non-Goals

**Goals:**
- Manter uma única preferência de idioma entre as páginas e os dois modos de visualização.
- Cobrir textos renderizados no servidor, textos renderizados no navegador e a demonstração estática.
- Transportar somente um identificador de idioma validado para a geração, sem expor configuração do provedor.

**Non-Goals:**
- Adicionar outros idiomas, tradução automática, detecção automática de idioma ou rotas separadas por localidade.
- Traduzir retrospectivamente conteúdo já gerado pelo modelo.

## Decisions

### Catálogo local de traduções no navegador

O cliente usará um catálogo explícito para `pt-BR` e `en`, com chaves para textos estáticos e dinâmicos, e atualizará também o atributo `lang` do documento. Isso mantém uma fonte compartilhável entre a aplicação Flask e as páginas estáticas, sem dependências adicionais nem duplicação de páginas. Templates fornecerão marcadores estáveis para os textos localizáveis.

Alternativa considerada: renderizar um conjunto de templates para cada rota e idioma. Foi descartada por duplicar rotas e por não resolver os textos dinâmicos da demonstração.

### Preferência local e padrão determinístico

A preferência será armazenada no navegador e restaurada no carregamento; ausência ou valor fora da lista permitida resultará em `pt-BR`. O seletor exibirá apenas as duas opções permitidas e permanecerá no canto superior direito, com comportamento responsivo e acessível.

Alternativa considerada: preferência em cookie ou sessão do servidor. Foi descartada porque a demonstração estática não possui servidor e não precisa de conta ou sincronização entre dispositivos.

### Idioma validado de ponta a ponta

As solicitações de geração enviarão o identificador selecionado. O servidor o normalizará contra uma lista fechada antes de compor a instrução de idioma para o modelo, preservando as regras dos perfis de uma palavra e de resposta completa. A resposta não será traduzida após a geração, pois isso quebraria sua relação com os tokens e probabilidades.

Alternativa considerada: confiar apenas no idioma do cliente. Foi descartada porque um payload pode ser modificado fora da interface.

### Artefatos estáticos como saída de primeira classe

O gerador estático continuará a produzir as mesmas páginas a partir dos templates atualizados e incluirá os recursos necessários ao seletor e à localização. A demonstração usará o catálogo para todos os rótulos e exemplos visíveis.

## Risks / Trade-offs

- [Texto novo sem chave de tradução] → revisar templates e scripts por literais voltados à pessoa usuária e testar ambos os idiomas.
- [Preferência corrompida no armazenamento local] → validar sempre antes de aplicar ou enviar o idioma.
- [Instrução de idioma conflitante com o contexto do usuário] → limitar a instrução ao idioma de saída e manter as restrições específicas de cada perfil.
- [Regressão entre aplicação local e site estático] → executar geração estática e validar os dois fluxos em ambos os formatos.

## Migration Plan

1. Adicionar o seletor, o catálogo e a normalização de idioma de forma compatível com o comportamento português existente.
2. Atualizar a geração estática e publicar os arquivos regenerados junto com os templates e recursos.
3. Em caso de regressão, remover o envio do idioma e manter o padrão `pt-BR`; preferências armazenadas inválidas continuarão a ser ignoradas com segurança.
