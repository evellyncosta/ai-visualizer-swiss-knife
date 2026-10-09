## Why

O Hallucination Path permite construir e finalizar uma continuação, mas não
oferece uma forma explícita de pedir uma avaliação do resultado concluído. A
verificação precisa ser uma ação deliberada e posterior ao encerramento para
preservar o caminho explorado como um registro imutável.

## What Changes

- Adicionar, abaixo da Árvore de caminhos, uma seção de verificação de
  alucinação para o ramo finalizado.
- Manter a seção inativa até a pessoa finalizar a exploração e oferecer um
  botão separado para solicitar a verificação.
- Enviar a premissa e a resposta final imutável à LLM somente após esse botão
  ser acionado e exibir se houve alucinação e o motivo retornado.
- Congelar escolhas de tokens, ramificações e caminho ativo ao finalizar a
  exploração; a verificação não poderá alterar o caminho.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `hallucination-path-visualization`: adicionar a verificação manual e
  posterior à finalização para um caminho imutável.

## Impact

- Template, estilos, localização e estado do cliente do Hallucination Path.
- Endpoint de geração e perfil de prompt para a avaliação estruturada pela LLM.
- Demonstração estática e testes de cliente e contrato do endpoint.
