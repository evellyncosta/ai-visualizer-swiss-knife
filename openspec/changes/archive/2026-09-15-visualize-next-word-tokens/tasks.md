## 1. Single-word generation

- [x] 1.1 Replace the sentence-completion system instruction with a next-lexical-word instruction and reduce the completion limit to 16 tokens; verify the generation request continues to request log probabilities.
- [x] 1.2 Validate provider output as one lexical word with an optional leading continuation delimiter, rejecting invalid multi-word or punctuated output without changing token boundaries; verify unit tests cover valid multi-token, invalid multi-word, and invalid punctuation responses.

## 2. Token-step data and visualization

- [x] 2.1 Preserve every selected token record for the valid word response and supply the frontend enough context to identify the prompt prefix before each selected token; verify a two-token fixture reconstructs the word without merging its records.
- [x] 2.2 Replace the hover-only probability list with a persistent selected-step table containing `Token` and `Probabilidade`, highlighting the selected token and explaining limited top-candidate coverage; verify no log-probability value or column is rendered.
- [x] 2.3 Render selected tokens as distinct, keyboard-accessible units and format invisible characters in labels (`␠`, `↵`, `⇥`) without changing the text reconstructed from raw tokens; verify selecting each token updates the table context and candidates.
- [x] 2.4 Update static demo data and interaction behavior to demonstrate a word assembled from multiple tokens; verify the GitHub Pages variant does not require live credentials.

## 3. Documentation and verification

- [x] 3.1 Update README and in-app instructional copy to explain that a word can contain multiple tokens and that displayed candidate probabilities do not cover every possible token; verify terminology consistently says `token`, not `word`, for probability rows.
- [x] 3.2 Run backend tests, JavaScript syntax checks, and template rendering checks; verify valid responses show one word, distinct token units, and a two-column probability table.
- [x] 3.3 With the configured environment key, perform one short live request using a context such as `o gato subiu no `; verify the response is accepted only when it is a single lexical word and includes probability data for each selected token.
