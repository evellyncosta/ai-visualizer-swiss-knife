## Context

`prompts.py` currently defines three `PromptTemplate` objects, their per-mode token limits, locale instructions, and the profile resolver. See `proposal.md` for motivation. The generated developer messages and returned limits must remain byte-for-byte equivalent to the current values.

## Goals / Non-Goals

**Goals:**

- Store each mode's prompt text and `max_tokens` in its own versioned YAML file.
- Keep `prompts.py` as the stable Python boundary for locale normalization, loading, validation, and rendering.
- Fail safely and descriptively when a packaged prompt file is malformed or incomplete.

**Non-Goals:**

- Allow runtime prompt editing, remote prompt retrieval, untrusted YAML input, arbitrary template variables, or fallback to stale in-code prompts.
- Change prompt wording, paths/modes, response validation, or public API behavior.

## Decisions

### One YAML asset per mode under `prompt_templates/`

The repository will contain `prompt_templates/word.yaml`, `prompt_templates/text.yaml`, and `prompt_templates/path.yaml`. Each file has exactly two application-owned fields: `template` and `max_tokens`.

Keeping one asset per mode makes changes reviewable in isolation and prevents an edit to one generation behavior from causing unrelated prompt conflicts. A single multi-document YAML file was considered but does not meet the requested per-prompt separation.

### Load packaged assets with `yaml.safe_load`

`prompts.py` will resolve prompt files relative to its own location, so the application does not depend on its launch directory. It will use PyYAML's safe loader and validate that the decoded value is a mapping with a non-empty string template and a positive integer `max_tokens`.

`safe_load` is selected over the default loader because prompt files are data, never executable Python objects. Hand-written parsing avoids a dependency but is brittle and does not implement YAML reliably.

### Preserve the existing Python rendering interface

The module will build `PromptTemplate` from each validated YAML template and retain `get_generation_profile(mode, locale) -> tuple[str, int]`. Locale instructions and allowed locale validation remain Python code because they are application rules shared across all prompt files.

Templates may expose only `{locale_instruction}`. Validation will reject missing or extra variables, preventing accidental new runtime inputs or silently incomplete provider instructions.

### Add PyYAML as a direct dependency

The dependency will be pinned in `requirements.txt`, making YAML parsing reproducible rather than relying on a transitive package from another library.

## Risks / Trade-offs

- [Invalid YAML prevents generation profiles from loading] -> Validate all prompt assets with targeted tests and raise a controlled configuration error with the affected file path.
- [Prompt text changes due to YAML whitespace semantics] -> Use literal block scalars and assert the rendered provider messages match the current strings exactly.
- [Unexpected template variables are introduced] -> Permit only `locale_instruction` during prompt-definition validation.
- [Relative paths break in production] -> Resolve assets from `Path(__file__).parent` and test from the project root.

## Migration Plan

1. Add PyYAML and the three YAML prompt assets containing the current prompt text and token limits.
2. Replace the in-code templates with a validated loader in `prompts.py` while preserving its public resolver.
3. Update tests for exact rendered output and invalid YAML definitions.
4. Deploy as a regular application release. Rollback restores the prior `prompts.py`; no data migration is necessary.
