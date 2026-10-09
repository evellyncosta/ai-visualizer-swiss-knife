## Context

O backend usa um único identificador de modelo para criar o `ChatOpenAI` e recebe os tokens de saída e os logprobs diretamente da resposta do provedor. A interface exibe esses tokens de saída, mas renderiza o contexto submetido como uma sequência de texto sem fronteiras de token. Veja a motivação em `proposal.md` e os contratos de comportamento nas specs desta mudança.

## Goals / Non-Goals

**Goals:**

- Associar a tokenização do contexto ao identificador de modelo já usado na geração, sem uma segunda configuração de modelo.
- Preservar a identidade de cada token do contexto, inclusive em limites que não formem UTF-8 válido isoladamente.
- Exibir entrada e saída como sequências diferentes, mantendo a saída selecionável para a tabela de probabilidades.
- Manter toda a resolução do tokenizer e a configuração do modelo no servidor.

**Non-Goals:**

- Não tokenizar o prompt interno de sistema nem os delimitadores internos do formato de mensagens do provedor.
- Não inferir probabilidades para tokens do contexto.
- Não trocar de provedor, permitir escolha de modelo na interface, nem alterar a regra de gerar uma única palavra.
- Não substituir os tokens de saída fornecidos pela API por uma retokenização local.

## Decisions

### Resolver a codificação pelo identificador de modelo compartilhado

O backend obterá a codificação por meio da resolução oficial do tokenizer para o mesmo valor de configuração usado pelo cliente de geração. A resolução falhará de forma explícita para um modelo sem mapeamento conhecido, em vez de usar uma codificação-base como fallback. Isso impede que uma futura troca de modelo pareça correta visualmente enquanto usa uma segmentação diferente.

Alternativas consideradas:

- Fixar uma codificação, como `o200k_base`: rejeitada porque ela pode deixar de corresponder a um modelo futuro.
- Configurar um segundo nome de modelo/tokenizer: rejeitada porque cria possibilidade de divergência silenciosa.

### Retornar registros de token de contexto orientados a bytes

O endpoint adicionará uma coleção `promptTokens` à resposta. Cada registro conterá o id do token e os bytes originais em uma forma segura para JSON; a interface derivará um rótulo legível a partir desses bytes, usando uma notação explícita quando eles não puderem ser decodificados isoladamente. O texto original do prompt continua sendo a referência de reconstrução do contexto.

O uso de bytes evita afirmar incorretamente que todo token individual é uma string UTF-8 válida: fronteiras de token podem cair dentro de uma sequência Unicode de múltiplos bytes. Espaços, quebras de linha e tabulações também receberão marcadores visíveis no rótulo educacional.

Alternativas consideradas:

- Enviar apenas texto decodificado por token: rejeitada porque pode introduzir caracteres de substituição e perder fidelidade em tokens isolados.
- Enviar somente ids: rejeitada porque obriga o frontend a conhecer o tokenizer e expõe uma dependência desnecessária ao navegador.

### Conservar as duas fontes de dados com papéis separados

Os tokens do contexto virão do tokenizer local, somente para explicar a segmentação da entrada. Os tokens selecionados, candidatos e probabilidades da palavra prevista continuarão vindo da resposta de logprobs do provedor. A interface apresentará os primeiros como unidades não selecionáveis e os últimos como botões que controlam a tabela existente.

Isso evita misturar uma segmentação pedagógica de entrada com a distribuição probabilística de saída e preserva a transparência sobre a origem de cada dado.

### Tornar a dependência do tokenizer explícita

O pacote de tokenizer será declarado diretamente nas dependências do projeto, mesmo que alguma dependência de alto nível o instale hoje de forma transitiva. Isso torna a capacidade reproduzível e auditável quando o cliente de modelo for atualizado.

## Risks / Trade-offs

- [O mapeamento do tokenizer não reconhecer um novo nome de modelo] → retornar erro claro no servidor e atualizar a dependência/mapeamento antes de disponibilizar o novo modelo.
- [Token individual conter bytes UTF-8 incompletos] → transportar os bytes e renderizar uma notação segura, sem usar uma decodificação com perda como identidade do token.
- [A interface ficar visualmente carregada para contextos longos] → preservar a sequência completa, mas aplicar estilo compacto e quebra de linha; a mudança não introduz truncamento silencioso.
- [A tokenização local não incluir o envelope interno de mensagens] → declarar e mostrar somente o contexto que o usuário digitou, que é o material pedagógico visível; não alegar representar tokens ocultos do protocolo.

## Migration Plan

1. Adicionar a dependência explícita e o resolvedor de tokenizer compartilhando a configuração de modelo existente.
2. Estender a resposta do endpoint com `promptTokens`, mantendo os campos atuais compatíveis.
3. Atualizar a interface para renderizar os tokens do contexto antes da palavra prevista e adaptar as respostas de demonstração.
4. Cobrir os contratos de tokenização, erros de mapeamento e renderização em testes; implantar como extensão compatível do endpoint.

O rollback remove a renderização de `promptTokens` e deixa consumidores existentes usando os campos de saída já disponíveis; não há migração de dados persistidos.
