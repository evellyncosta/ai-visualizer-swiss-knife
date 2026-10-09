## Why

The prompt content is isolated from `app.py` but still grouped in one Python module. Storing each prompt as a dedicated YAML asset makes individual prompts easier to review and edit without mixing content with prompt-loading logic.

## What Changes

- Replace the three in-code prompt templates with one YAML file per generation mode: word, text, and path.
- Load, validate, and render YAML prompt definitions through the existing Python prompt interface.
- Preserve the current mode names, locale injection, token limits, provider messages, API behavior, and validation.
- Update tests to cover YAML-backed profile rendering and invalid prompt-definition handling.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This refactor does not change externally observable generation behavior.

## Impact

- Affected code: `prompts.py`, prompt asset files, tests, and dependency declarations if a YAML parser is not already available.
- No API, UI, or model configuration changes are expected.
