## Context

The Flask endpoint currently builds an OpenAI SDK client and reads the chat-completion object directly. Its visualizer contract depends on output token log probabilities, while credentials remain in `OPENAI_API_KEY` on the server. See `proposal.md` for the reason to introduce LangChain.

## Goals / Non-Goals

**Goals:**

- Introduce a focused LangChain adapter without changing the browser-to-server request or response contract.
- Retain token-level selected and alternative probabilities used by the existing visualizer.
- Keep the implementation ready to isolate future provider/model changes behind the LangChain model boundary.

**Non-Goals:**

- Making provider or model selection configurable.
- Adding chains, agents, tools, retrieval, LangSmith tracing, streaming, or frontend controls.
- Changing the application's current OpenAI model or environment variable names.

## Decisions

### Use the provider-specific `ChatOpenAI` integration

The backend will use `langchain_openai.ChatOpenAI`, rather than a generic model factory, because the application remains OpenAI-only and needs the integration's OpenAI-specific logprob behavior. It will read `OPENAI_API_KEY` from the existing server environment.

Alternative considered: `init_chat_model`. Rejected for now because it would imply provider abstraction before the product needs it and adds configuration decisions to this scoped refactor.

### Preserve logprob metadata at the adapter boundary

The backend will configure `ChatOpenAI` with `logprobs=True` and the requested `top_logprobs`, then obtain provider logprob metadata from the returned `AIMessage`. A small adapter will convert it to the existing `text` and `tokenProbs` response shape.

Alternative considered: returning LangChain's `AIMessage` directly. Rejected because it would break the frontend contract and expose framework/provider representation details to the browser.

### Keep a single synchronous invocation path

The Flask endpoint will continue to make one synchronous model invocation for each generation request. The existing server-side validation and safe error handling remain in place.

Alternative considered: streaming through LangChain. Rejected because the current UI renders the response only after it has complete per-token probability data.

## Risks / Trade-offs

- [LangChain changes the exact metadata nesting between versions] -> Pin or set a compatible `langchain-openai` version and cover the adapter using realistic metadata fixtures plus a live smoke test.
- [A model response omits logprob metadata] -> Continue treating it as a safe generation failure rather than returning incomplete visualization data.
- [The new abstraction adds overhead] -> Restrict dependencies to `langchain-openai` and avoid optional LangChain subsystems.

## Migration Plan

1. Replace the application dependency on the direct OpenAI client with `langchain-openai`.
2. Implement the `ChatOpenAI` invocation and response-metadata adapter while preserving validation and API output.
3. Update unit tests to mock LangChain's response and run a real OpenAI smoke test with the existing environment key.
4. Retain the prior direct-SDK implementation in version history for straightforward rollback if metadata compatibility fails.
