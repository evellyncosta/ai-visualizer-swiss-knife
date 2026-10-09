## Context

O modo de token usa o endpoint de geração para prever uma única palavra, com validação estrita e limite pequeno de saída. A página de frase existe apenas como marcador. O adaptador atual já preserva tokens e probabilidades do provedor em cada etapa, o que pode ser reutilizado para uma resposta maior. Veja `proposal.md` para a motivação e as specs desta mudança para os contratos de comportamento.

## Goals / Non-Goals

**Goals:**

- Transformar a página de frase em um visualizador funcional de respostas completas.
- Preservar a correspondência exata entre o texto exibido, seus tokens selecionados e as probabilidades do provedor.
- Permitir parágrafos e exibir suas quebras de forma pedagógica.
- Manter o modo de uma palavra isolado e inalterado.

**Non-Goals:**

- Não adicionar Markdown, streaming, edição de resposta, histórico ou persistência.
- Não tornar 500 caracteres um corte rígido nem truncar resultados.
- Não oferecer seleção de modelo ou expor configuração do provedor no navegador.

## Decisions

### Usar um perfil de geração explícito no endpoint existente

O cliente enviará um modo de geração explícito. A ausência desse campo preserva o perfil atual de uma palavra; o modo `text` seleciona um prompt de sistema, validação e limite de tokens próprios. Essa evolução mantém um único endpoint e o contrato comum de tokens/probabilidades, sem fazer o visualizador de token depender das regras de texto.

Alternativa considerada: criar um segundo endpoint. Foi rejeitada porque duplicaria a adaptação de logprobs e a proteção de credenciais para uma diferença que é um perfil de geração.

### Preservar a rota legada de frase

A página inicial passa a expor somente `Visualizar texto`, enquanto a rota anterior de frase encaminha ao novo modo. Isso evita quebrar links ou favoritos produzidos enquanto a página era um marcador de construção.

### Instruir 500 caracteres, mas preservar a saída recebida

O prompt de sistema solicitará texto simples, sem Markdown, de até 500 caracteres e permitirá parágrafos. O servidor terá um limite de tokens maior como proteção de custo, mas não cortará a saída com base em caracteres. Cortar texto depois da resposta poderia apagar parte de um token e romper a demonstração de como o modelo o gerou.

### Validar texto simples sem transformar tokens

Após a resposta, a validação rejeitará sinais de Markdown em vez de limpar ou reformatar o conteúdo. Ela também verificará que a concatenação dos tokens do provedor é exatamente o texto recebido. As quebras de linha e parágrafo permanecem válidas.

### Reaproveitar a tabela por etapa de token

A página de texto usará o mesmo padrão de seleção: ao clicar em um token, a tabela mostra as alternativas retornadas para aquela posição. O contexto exibido combina a instrução original com todos os tokens anteriores da resposta. A apresentação renderiza quebras estruturais e, simultaneamente, usa indicadores visíveis para os tokens correspondentes.

## Risks / Trade-offs

- [O modelo exceder 500 caracteres] → manter a resposta integral, pois o limite é uma instrução e não uma regra de truncamento.
- [Falso positivo ou negativo na detecção de Markdown] → iniciar com padrões comuns de Markdown e retornar erro seguro; ajustar a detecção conforme exemplos reais sem modificar conteúdo.
- [Resposta longa tornar a página densa] → usar quebra de linha, estilo compacto e rolagem natural, sem ocultar tokens.
- [Mudança no perfil afetar o modo token] → manter prompts, limites e validadores separados e testar os dois perfis.

## Migration Plan

1. Renomear a opção e a página de frase para texto, encaminhar a rota legada e atualizar a navegação estática.
2. Adicionar o perfil de geração de texto ao backend, com limite de tokens apropriado, prompt e validação próprios.
3. Adaptar a interface para enviar o perfil de texto e preservar parágrafos na resposta tokenizada.
4. Cobrir os dois perfis em testes de backend e interface, incluindo respostas acima de 500 caracteres e conteúdo Markdown recusado.

O rollback restaura a página de texto como marcador de construção e remove somente o perfil adicional; o modo de token e o endpoint existente continuam disponíveis.
