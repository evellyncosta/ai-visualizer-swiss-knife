## Why

The visualizer currently depends on Azure OpenAI configuration supplied through the browser, exposing provider-specific setup in an interface intended to focus on token-probability exploration. Using the OpenAI API directly with server-side environment configuration simplifies the experience and keeps credentials out of client requests.

## What Changes

- **BREAKING** Replace the Azure OpenAI backend integration with the direct OpenAI API.
- Read the OpenAI API key from the server environment rather than from an API request.
- Remove Azure endpoint and API-key fields from the local application interface and API payload.
- Preserve token-probability visualization by returning generated text and selected/top token probabilities from the OpenAI response.
- Document local configuration through an untracked `.env` file and a committed `.env.example` template.

## Capabilities

### New Capabilities

- `openai-probability-generation`: Generate a completion through the OpenAI API using server-side configuration and expose its token probabilities to the visualizer.

### Modified Capabilities

- None.

## Impact

- Affects `app.py`, the local frontend template and script, environment-file conventions, and README setup instructions.
- Replaces `AzureOpenAI` client usage with `OpenAI` from the existing OpenAI Python SDK dependency.
- Changes the `/api/generate` request contract by removing `endpoint` and `api_key`.
