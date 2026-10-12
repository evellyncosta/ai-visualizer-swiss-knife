## Context

O navegador já recebe e valida uma coleção ordenada de `captured_steps`, mas ela só permanece em memória; a área de resultado exibe exclusivamente o PNG final. O controle de captura é um checkbox estilizado como rótulo. Veja `proposal.md` para a motivação e a especificação delta para o comportamento observável.

## Goals / Non-Goals

**Goals:**

- Tornar cada frame de captura visível e selecionável no resultado da geração.
- Manter uma interação de ativação clara, operável por teclado e comunicada por semântica ARIA.
- Preservar os contratos de API e o caminho de geração sem captura.

**Non-Goals:**

- Transmitir frames enquanto a inferência está em andamento.
- Persistir frames no servidor ou no navegador.
- Alterar parâmetros de inferência, validação do backend ou o download da imagem final.

## Decisions

### Botão toggle semântico

O controle será um elemento `button` com `aria-pressed`, em vez de um checkbox visualmente estilizado. Essa escolha torna explícito o padrão solicitado, mantém suporte nativo a teclado e comunica o estado a tecnologias assistivas. Um switch baseado em checkbox foi descartado porque ainda preservaria o controle atual em vez de estabelecer uma ação de toggle clara.

### Faixa de miniaturas com visualização selecionada

Depois de uma resposta de captura bem-sucedida, o cliente converterá cada PNG Base64 em um recurso temporário para a miniatura e construirá uma sequência na ordem da resposta. Cada item mostrará `step` e `timestep`; ao ser selecionado, substituirá a visualização ampliada. A imagem final continuará em posição e identificação próprias, e seguirá sendo a origem do download.

Uma animação automática foi descartada: ela dificultaria a inspeção de uma etapa e acrescentaria comportamento de reprodução que não foi solicitado. Uma galeria em que apenas a primeira imagem aparece também foi descartada por não resolver a invisibilidade dos frames.

### Gestão de memória e substituição de resultado

Os URLs de objeto de todas as miniaturas e da imagem ampliada serão centralizados no estado efêmero e revogados ao iniciar uma nova geração, ao trocar resultados e ao descarregar a página. O resultado anterior só será substituído após uma resposta válida, evitando deixar a interface em estado inconsistente quando a geração falhar.

## Risks / Trade-offs

- [Muitos frames podem tornar a resposta visual extensa e consumir memória] -> usar miniaturas responsivas, limitar cada frame aos dados já validados pelo backend e revogar todos os URLs temporários quando o resultado for descartado.
- [A mudança de seleção pode confundir o download] -> manter a imagem final explicitamente identificada e fazer o botão de download sempre baixar a imagem final.
- [Metadados técnicos podem ser pouco claros] -> usar rótulos localizados para etapa e timestep e associá-los a cada miniatura.

## Migration Plan

Não há migração de dados nem alteração de contrato. O rollout substitui apenas a interface estática; em caso de rollback, restaurar os assets anteriores volta a exibir somente a imagem final, enquanto o endpoint continua compatível.
