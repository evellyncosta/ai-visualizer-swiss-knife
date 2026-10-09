## Context

The Flask backend currently constructs an Azure OpenAI client per request from an endpoint and API key supplied by the browser. The page exposes those provider settings alongside the prompt, while the visualization already consumes a provider-neutral response containing generated text and token probabilities. See `proposal.md` for motivation and `specs/openai-probability-generation/spec.md` for behavior requirements.

## Goals / Non-Goals

**Goals:**

- Keep credentials and provider endpoint details entirely server-side.
- Preserve the response data that drives the token hover visualization.
- Make the local application a focused probability visualizer with no provider setup UI.

**Non-Goals:**

- Supporting Azure OpenAI or a runtime provider selector.
- Persisting user prompts, completions, or API credentials.
- Changing the static GitHub Pages demo into a live API client.

## Decisions

### Use the direct OpenAI client with server environment configuration

The backend will use the OpenAI Python client configured from `OPENAI_API_KEY`, which `python-dotenv` loads locally from `.env`. The browser will send only non-sensitive generation inputs to `/api/generate`.

This removes provider configuration from user interaction and avoids transmitting the secret on every request. Azure configuration and the `AzureOpenAI` client will be removed rather than retained behind a compatibility branch.

Alternative considered: keep browser-provided credentials. Rejected because it exposes a secret to client-side code and conflicts with the focused visualizer experience.

### Preserve Chat Completions for this visualizer

The backend will continue using the Chat Completions-style request and enable `logprobs` with `top_logprobs`. This produces the per-output-token alternatives required by the current response adapter and avoids a visualization-facing schema change.

Alternative considered: migrate to the Responses API. Rejected for this change because it adds response-parsing work without improving the required token-probability display.

### Keep the visualizer response contract stable

The backend will adapt the OpenAI response into the existing `text` and `tokenProbs` payload. Each record will retain `selected_token`, `selected_prob`, and `top_logprobs`, converting log probabilities to linear probabilities as today.

Alternative considered: return the provider's raw response. Rejected because it couples the browser visualizer to an external API schema.

### Establish safe local environment-file conventions

The repository will add `.env.example` containing an empty `OPENAI_API_KEY` assignment and ensure `.env` is ignored. The real key is supplied only by a developer or deployment environment and is never committed.

Alternative considered: commit a populated `.env`. Rejected because it risks publishing a credential.

## Risks / Trade-offs

- [The selected model does not provide requested log probabilities] -> Use a model/configuration compatible with the required Chat Completions logprob fields and surface provider errors without leaking configuration.
- [A developer runs the app without `.env`] -> Return a clear server-configuration error and document setup in README and `.env.example`.
- [A generated response has no content logprobs, such as an unusual provider response] -> Handle it as a generation failure rather than returning misleading visualization data.
- [The local API is exposed beyond trusted use] -> This change removes browser-provided secrets but does not add authentication, rate limiting, or multi-user secret management; deployment owners must provide those controls if needed.

## Migration Plan

1. Add the environment template and ignore rule before introducing the direct OpenAI configuration.
2. Replace Azure request handling and remove provider fields from the browser-to-server contract.
3. Update the local UI and README for the prompt-only workflow.
4. Verify successful probability generation with a configured API key and verify that missing configuration and provider errors are safe.

Rollback consists of reverting the change as a unit; there is no data migration or persisted provider state.
