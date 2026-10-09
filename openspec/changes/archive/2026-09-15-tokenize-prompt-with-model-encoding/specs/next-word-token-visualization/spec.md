## MODIFIED Requirements

### Requirement: Faithful token construction display
The visualizer SHALL render every selected provider token for the predicted word as a distinct, selectable token in generation order. It SHALL NOT merge tokens to resemble a word or alter their underlying values. When model-aligned context tokens are available, the visualizer SHALL render them as a visually distinct, non-selectable sequence before the selected provider tokens.

#### Scenario: Word split across tokens
- **WHEN** the predicted word is formed by selected tokens `tel` followed by `hado`
- **THEN** the visualizer SHALL show two distinct selectable token units whose concatenation forms `telhado`

#### Scenario: Whitespace token representation
- **WHEN** a selected token contains a leading space, newline, or tab
- **THEN** the educational token display SHALL make that character visible while the generated text itself retains its original content

#### Scenario: Tokenized context precedes output construction
- **WHEN** the system returns tokenized context for `o gato subiu no ` and the predicted word is formed by selected provider tokens
- **THEN** the visualizer SHALL show the context token sequence before, and visually distinct from, the selectable output-token sequence
