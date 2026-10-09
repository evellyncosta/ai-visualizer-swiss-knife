## Context

The application already receives selected output tokens and top candidate probabilities for each generation position. It currently asks for a short continuation and renders the candidates only in a transient hover tooltip. See `proposal.md` for the motivation and `specs/next-word-token-visualization/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Limit each generation to one lexical word without losing the provider's token boundaries.
- Make each token-generation step inspectable in a stable, teaching-oriented table.
- Explain token boundaries, including whitespace, accurately.

**Non-Goals:**

- Computing a probability for an entire word or exploring alternative multi-token word branches.
- Altering, grouping, or retokenizing provider tokens.
- Letting users choose the model, provider, or candidate-count in this change.

## Decisions

### Request one word but allow multiple output tokens

The system instruction will request exactly one lexical word, without punctuation or explanation. The output cap will be reduced from sentence length to a modest multiple-token allowance (16 tokens) so a long word can be produced without allowing a normal sentence continuation.

A response is valid only when it contains one lexical word, optionally preceded by a single continuation delimiter. Invalid responses will fail rather than being trimmed, because trimming a token can falsify the token/probability relationship.

Alternative considered: generate a sentence then keep its first whitespace-delimited word. Rejected because the removed content can share a provider token with the retained word and would misrepresent the actual token sequence.

### Keep provider tokens as the source of truth

The backend will continue returning selected token records and top candidate probabilities. The frontend will build the visible word by concatenating selected tokens, but will render each record as its own selectable unit.

Alternative considered: tokenize the completed word again in the browser. Rejected because a local tokenizer may not match the model and would discard the original conditional probabilities.

### Use a persistent, selected-step table

The visualizer will select the first output token initially and update a persistent table when the learner clicks or keyboard-selects another token. The table will show the context before the selected token, top candidates, percentage probabilities, and an indicator for the actual selected token. It will note that only the top candidates are shown.

Alternative considered: retain hover-only details. Rejected because hover disappears during explanation and is difficult to use accessibly.

### Render invisible characters only in token labels

The visual token label will represent leading spaces as `␠`, newlines as `↵`, and tabs as `⇥`; the raw token value used for text reconstruction and comparison remains unchanged. Token labels will use a fixed-width treatment to make boundaries clear.

## Risks / Trade-offs

- [The model occasionally violates the single-word instruction] -> Validate the full response and return a safe error instead of displaying inaccurate boundaries.
- [A word requires more than 16 tokens] -> Treat it as a generation failure and raise the cap only with evidence from intended languages/models.
- [Top candidates do not sum to 100%] -> State that undisplayed tokens retain probability mass; do not normalize the displayed values.
- [The selected token is absent from top candidates] -> Show it separately with its returned selected probability while retaining the top-candidate rows.

## Migration Plan

1. Update the generation instruction, output limit, and validation tests for single-word output.
2. Keep the response token records intact and update sample data to contain a multi-token word.
3. Replace the hover-only candidate list with the persistent selected-step table and token-boundary affordances.
4. Validate a live generation that returns a multi-token word when available, plus deterministic frontend and backend test fixtures.
