## Context

`app.py` currently owns three static system prompts, locale instructions, per-mode token limits, and the logic that combines them. See `proposal.md` for motivation. The API must continue to send the same rendered developer message and token limits for every supported mode and locale.

## Goals / Non-Goals

**Goals:**

- Make a dedicated module the source of truth for prompt templates and generation profiles.
- Render each prompt with the normalized locale instruction through a named template placeholder.
- Keep prompt-focused test imports independent of Flask application orchestration.

**Non-Goals:**

- Change prompt wording, supported modes/locales, model settings, API payloads, or response validation.
- Introduce configuration storage, runtime prompt editing, or new dependencies.

## Decisions

### Dedicated `prompts.py` module

The module will define the three prompt templates, locale instruction mapping, token limits, and a profile resolver returning the rendered system prompt plus `max_tokens`.

`app.py` will import the resolver and retain request handling, provider invocation, and validation. This makes the entrypoint depend on prompt configuration without owning it.

An alternative is a separate template file per mode. That adds file-loading and packaging concerns without a present need for independently managed prompt assets.

### Use LangChain prompt templates

Each static system prompt will be represented as a `PromptTemplate` with a `{locale_instruction}` variable and formatted by the profile resolver. LangChain is already a direct application dependency through `langchain-openai`, so this aligns prompt construction with the provider integration without adding a package.

An f-string remains simpler, but would not establish the requested explicit prompt-template boundary.

### Tests import prompt definitions from their owner

Tests that assert prompt content or rendered developer messages will import prompt constants/templates from `prompts.py`; they will no longer rely on prompt re-exports from `app.py`. Endpoint tests continue to exercise the rendered result through the API.

## Risks / Trade-offs

- [A template formatting change alters an otherwise stable provider instruction] -> Preserve exact prompt text and add/retain assertions for rendered messages, locale selection, and max tokens.
- [Moving constants causes stale imports] -> Update all repository imports and run the full test suite.
- [Template syntax escapes are misinterpreted] -> Use only the locale placeholder and verify all three modes.

## Migration Plan

1. Add the prompt module and move the existing definitions without semantic changes.
2. Delegate profile resolution from `app.py` to the module.
3. Update unit tests to import prompt symbols from the new module and verify behavior.
4. Deploy as a normal application release; rollback is a source-level revert because no data or API migration occurs.
