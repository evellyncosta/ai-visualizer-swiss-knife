## 1. LangChain dependency

- [x] 1.1 Replace the direct application dependency on the OpenAI SDK with `langchain-openai`; verify the project environment installs dependencies and imports `ChatOpenAI` successfully.

## 2. Generation adapter

- [x] 2.1 Replace direct OpenAI client construction and invocation with `ChatOpenAI`, using the existing server-side `OPENAI_API_KEY`, model, generation controls, and prompt messages; verify the browser request contract remains unchanged.
- [x] 2.2 Adapt `AIMessage` content and logprob response metadata into the existing `text` and `tokenProbs` payload, preserving safe errors when logprobs are absent; verify unit tests cover a realistic LangChain metadata fixture.
- [x] 2.3 Update tests to mock the LangChain model rather than the direct SDK, and verify missing configuration and provider failures remain safe.

## 3. Verification

- [x] 3.1 Run syntax checks and the automated test suite; verify no direct application import or client construction from the OpenAI SDK remains.
- [x] 3.2 With the configured environment key, make one short live generation request and verify the response includes completion text and token probability records.
