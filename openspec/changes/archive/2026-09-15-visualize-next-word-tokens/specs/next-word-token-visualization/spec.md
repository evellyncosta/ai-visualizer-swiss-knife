## Purpose

Help learners observe how a language model constructs one predicted word through one or more individual tokens and their probability distributions.

## ADDED Requirements

### Requirement: Single-word prediction
The system SHALL generate exactly one next lexical word for a supplied text context. The generated output MAY include one leading whitespace delimiter when required to continue the context, but SHALL NOT include additional words, punctuation, explanations, formatting, or trailing whitespace.

#### Scenario: Predict a next word
- **WHEN** a user submits the context `o gato subiu no `
- **THEN** the system SHALL return one predicted word and its selected token sequence

#### Scenario: Invalid multi-word model output
- **WHEN** the provider response contains more than one word or disallowed punctuation
- **THEN** the system SHALL return a safe generation error rather than silently truncating, merging, or misrepresenting token data

### Requirement: Faithful token construction display
The visualizer SHALL render every selected provider token for the predicted word as a distinct, selectable token in generation order. It SHALL NOT merge tokens to resemble a word or alter their underlying values.

#### Scenario: Word split across tokens
- **WHEN** the predicted word is formed by selected tokens `tel` followed by `hado`
- **THEN** the visualizer SHALL show two distinct selectable token units whose concatenation forms `telhado`

#### Scenario: Whitespace token representation
- **WHEN** a selected token contains a leading space, newline, or tab
- **THEN** the educational token display SHALL make that character visible while the generated text itself retains its original content

### Requirement: Per-step next-token probability table
The visualizer SHALL show a persistent table for the currently selected token's generation step. The table SHALL contain only the columns `Token` and `Probabilidade`, and SHALL identify the selected token among the returned candidate tokens.

#### Scenario: Inspect first token alternatives
- **WHEN** a user selects the first token of a predicted word
- **THEN** the table SHALL show the top candidate tokens and probabilities for the prompt context before that token was selected

#### Scenario: Inspect a later token alternative
- **WHEN** a user selects a later token of a multi-token word
- **THEN** the table SHALL show the candidates and probabilities after the context plus all preceding selected tokens

#### Scenario: Limited candidate distribution
- **WHEN** the table shows only a configured number of top candidates
- **THEN** the visualizer SHALL indicate that tokens outside the displayed candidates can also have probability mass

### Requirement: No exposed log probabilities
The user-facing visualizer SHALL NOT display a log-probability value or a log-probability column.

#### Scenario: Display probability table
- **WHEN** a token probability table is rendered
- **THEN** it SHALL show probabilities in a human-readable percentage format without showing log probabilities
