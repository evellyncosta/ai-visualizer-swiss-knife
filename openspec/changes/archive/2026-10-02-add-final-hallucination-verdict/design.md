## Context

O Hallucination Path já mantém localmente uma árvore de escolhas, a premissa
inicial e o prefixo de resposta do ramo ativo. Atualmente, finalizar a
exploração somente informa o estado na interface e não bloqueia novas escolhas.
Veja `proposal.md` para a motivação.

## Goals / Non-Goals

**Goals:**

- Tratar a finalização como transição para um estado imutável do caminho.
- Expor uma verificação solicitada manualmente depois dessa transição, sem
  alterar o estado do caminho.
- Obter e validar um veredito binário e seu motivo de forma previsível.

**Non-Goals:**

- Avaliar automaticamente tokens, ramos ou a ação de finalizar.
- Permitir retomar, editar ou ramificar uma exploração concluída.
- Fazer fact-checking por fontes externas ou apresentar a avaliação como prova
  factual independente.

## Decisions

### Estado final explícito no cliente

O estado do caminho terá uma marca de finalização. Ao finalizar, o cliente
congelará a árvore e o ramo ativo e desabilitará ações que poderiam criar tokens
ou trocar de ramo. A seção de verificação passará a permitir a solicitação.

Manter o comportamento atual de apenas exibir uma mensagem foi descartado, pois
ele permite modificar a exploração depois de marcada como concluída.

### Verificação acionada em seção própria

A nova seção será renderizada imediatamente abaixo do painel da Árvore de
caminhos. Ela conterá o botão de verificação, estado de carregamento, resultado
e erro. O botão não será acionado por `Finalizar exploração`; somente uma ação
explícita da pessoa iniciará a chamada.

Colocar o botão no painel do caminho ativo ou vinculá-lo à finalização foi
descartado para manter separados o encerramento da exploração e a avaliação.

### Snapshot final e contrato estruturado

No momento da verificação, o cliente enviará a premissa e a resposta já
concluídas, sem reconstruí-las a partir de uma árvore mutável. O servidor usará
um perfil específico de avaliação e devolverá um contrato estruturado com um
booleano de alucinação e um motivo textual. A interface rejeitará respostas que
não correspondam ao contrato.

Reutilizar o perfil de continuação do caminho foi descartado porque ele produz
prosa, não um veredito verificável pelo cliente.

## Risks / Trade-offs

- [A LLM avaliadora pode errar o veredito] → apresentar o resultado como a
  resposta solicitada à LLM e manter o motivo visível.
- [Uma resposta curta não permite avaliação útil] → o motivo retornado explica
  o veredito; falhas de contrato recebem um estado de erro, não um resultado
  inventado.
- [Uma resposta de rede falha] → manter o caminho congelado e permitir nova
  tentativa de verificação.

## Migration Plan

1. Adicionar o estado de finalização e bloquear as ações de alteração do caminho.
2. Adicionar o perfil e o contrato de verificação no servidor.
3. Renderizar a seção abaixo da Árvore de caminhos e conectá-la ao contrato.
4. Atualizar demonstração, traduções e testes.
5. Em rollback, remover a seção e o contrato de verificação; os caminhos
   existentes continuam sendo exploráveis como antes.
