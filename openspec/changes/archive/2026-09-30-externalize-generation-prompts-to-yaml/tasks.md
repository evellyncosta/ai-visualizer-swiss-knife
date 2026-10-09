## 1. YAML prompt assets and dependency

- [x] 1.1 Add a pinned PyYAML dependency and verify a clean environment can import `yaml` after installing `requirements.txt`.
- [x] 1.2 Create `prompt_templates/word.yaml`, `prompt_templates/text.yaml`, and `prompt_templates/path.yaml` with the current template text and per-mode token limit; verify each file parses as a mapping with `template` and `max_tokens`.

## 2. YAML-backed prompt loading

- [x] 2.1 Replace the in-code prompt definitions in `prompts.py` with a module-relative, `yaml.safe_load`-based loader; verify `get_generation_profile` preserves the rendered prompt text and token limits for every mode and supported locale.
- [x] 2.2 Validate prompt definitions for required fields, positive integer token limits, and the sole `{locale_instruction}` variable; verify malformed definitions raise a clear configuration error rather than silently falling back.

## 3. Regression coverage

- [x] 3.1 Update prompt and endpoint tests to cover YAML-backed rendering, exact provider messages, and invalid prompt definitions; verify the targeted tests pass.
- [x] 3.2 Run `python -m unittest test_app.py` in an environment with project dependencies installed and verify the full test suite passes.
