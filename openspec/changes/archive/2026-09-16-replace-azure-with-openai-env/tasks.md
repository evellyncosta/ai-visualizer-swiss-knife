## 1. Environment and documentation

- [x] 1.1 Add `.env.example` with the required empty `OPENAI_API_KEY` variable and add `.env` to version-control ignores; verify `git check-ignore .env` reports it as ignored.
- [x] 1.2 Update README local setup and technical details for direct OpenAI configuration and the prompt-only interface; verify Azure endpoint/key setup references are removed.

## 2. Server-side OpenAI generation

- [x] 2.1 Replace Azure client construction with direct OpenAI client configuration sourced from `OPENAI_API_KEY`; verify a configured local request reaches the OpenAI API without browser credentials.
- [x] 2.2 Update `/api/generate` validation and request parsing to accept only generation inputs, safely handle missing server configuration and provider failures, and preserve the `text`/`tokenProbs` response contract; verify successful and error responses with Flask tests or test-client requests.
- [x] 2.3 Adapt direct OpenAI completion logprobs into the selected-token and top-alternative probability records required by the visualizer; verify each generated output token yields a renderable probability record.

## 3. Focused visualizer interface

- [x] 3.1 Remove Azure endpoint and API-key controls from the template and retain prompt submission controls; verify no provider configuration inputs are rendered.
- [x] 3.2 Remove endpoint and API-key collection from the local JavaScript request while preserving loading, error, and token-tooltip behavior; verify the outgoing payload contains no credentials or endpoint fields.

## 4. End-to-end verification

- [x] 4.1 Run the local application with a configured OpenAI key and verify a prompt produces hoverable token probabilities; verify a missing key produces a safe configuration error without exposing secret values.
- [x] 4.2 Run relevant syntax or automated checks and inspect the final diff to confirm Azure client usage and Azure configuration UI are absent from the live local path.
