## Why

The generation prompts and their assembly rules live directly in `app.py`, mixing static prompt content with request orchestration and making the application entrypoint harder to maintain. Centralizing them as templates keeps prompt authoring isolated while preserving generation behavior.

## What Changes

- Move the word, text, and path system-prompt definitions to a dedicated prompt module.
- Define prompt templates that inject the resolved locale instruction into each system prompt.
- Have `app.py` obtain the rendered prompt and its generation settings from the new module.
- Update tests to import prompt definitions from the new module rather than from `app.py`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This is an internal refactor that preserves externally observable generation behavior.

## Impact

- Affected code: `app.py`, a new prompt module, and `test_app.py`.
- No API, UI, model, or dependency changes are expected.
