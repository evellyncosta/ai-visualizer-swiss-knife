## Why

The current visualizer generates a multi-token continuation, which hides the moment-by-moment process learners need to understand. Restricting output to the next word makes it possible to show how a single human-readable word is assembled from one or more model tokens and their competing alternatives.

## What Changes

- **BREAKING** Change generation from a short sentence continuation to exactly one next lexical word.
- Replace the generation instruction with a next-word-only instruction and reduce the generation limit while allowing enough tokens to form a long word.
- Validate that returned output represents one word and fail safely rather than displaying multiple words or altered token boundaries.
- Present the generated word as its original sequence of selected tokens.
- Add a persistent, selectable next-token probability table for each selected token, showing token and probability only.
- Make whitespace and control-character tokens legible in the educational display without altering their underlying values.

## Capabilities

### New Capabilities

- `next-word-token-visualization`: Generate one next word and let learners inspect the probability distribution and construction step for every token that forms it.

### Modified Capabilities

- None.

## Impact

- Affects the Flask generation prompt, output validation and limits, API error handling, the local visualizer template/script/styles, static demo data, tests, and README guidance.
- Retains LangChain, OpenAI environment configuration, and the existing token-probability data model as the source of truth.
