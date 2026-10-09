## 1. Prompt module extraction

- [x] 1.1 Create `prompts.py` with LangChain templates for word, text, and path modes plus locale instructions and token limits; verify each supported mode renders its existing prompt text with the expected locale instruction.
- [x] 1.2 Implement the prompt-profile resolver in `prompts.py`; verify it returns the existing token limit for each mode and raises the existing invalid-mode error.

## 2. Application and test integration

- [x] 2.1 Update `app.py` to import and use the prompt-profile resolver without retaining prompt definitions; verify `/api/generate` continues to send the rendered developer prompt to `ChatOpenAI`.
- [x] 2.2 Update `test_app.py` to import prompt definitions from `prompts.py`; verify assertions cover Portuguese and English rendering and path-mode prompt content.
- [x] 2.3 Run the full test suite with `python -m unittest test_app.py` and verify all tests pass.
