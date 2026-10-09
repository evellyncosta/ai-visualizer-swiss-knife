## Why

The application currently calls the OpenAI SDK directly. Adopting LangChain now provides a stable application-level model interface for future provider and model changes while preserving the focused OpenAI-backed probability visualizer today.

## What Changes

- Replace the direct OpenAI SDK invocation in the generation backend with LangChain's `ChatOpenAI` integration.
- Preserve the current OpenAI provider, `OPENAI_API_KEY` environment configuration, model, request API, and token-probability response contract.
- Read log-probability metadata returned through LangChain and adapt it to the existing visualization payload.
- Add the focused LangChain OpenAI dependency and revise implementation tests for the adapter.
- Do not introduce provider selection, model selection, agents, tools, tracing, or frontend changes in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None.

This is an internal refactor with no externally observable requirement changes; specs are intentionally skipped.

## Impact

- Affects the generation implementation in `app.py`, Python dependencies, tests, and technical documentation as needed.
- Replaces direct `openai` SDK client usage in the application with `langchain-openai` while retaining the OpenAI API and server-side credentials.
