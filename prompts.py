from pathlib import Path
from typing import Dict, Tuple

import yaml
from langchain_core.prompts import PromptTemplate


DEFAULT_LOCALE = "pt-BR"
SUPPORTED_LOCALES = {"pt-BR", "en"}
LOCALE_INSTRUCTIONS = {
    "pt-BR": "Respond in Brazilian Portuguese.",
    "en": "Respond in English.",
}
PROMPT_TEMPLATE_DIRECTORY = Path(__file__).parent / "prompt_templates"
PROMPT_FILES = {
    "word": "word.yaml",
    "text": "text.yaml",
    "path": "path.yaml",
    "verification": "verification.yaml",
}
REQUIRED_PROMPT_FIELDS = {"template", "max_tokens"}
REQUIRED_TEMPLATE_VARIABLES = {"locale_instruction"}


def _invalid_prompt_definition(path: Path, detail: str) -> RuntimeError:
    return RuntimeError(f"Invalid prompt definition '{path.name}': {detail}")


def load_prompt_definition(path: Path) -> Tuple[PromptTemplate, int]:
    try:
        definition = yaml.safe_load(path.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as error:
        raise _invalid_prompt_definition(path, "could not be loaded") from error

    if not isinstance(definition, dict) or set(definition) != REQUIRED_PROMPT_FIELDS:
        raise _invalid_prompt_definition(
            path, "must contain only 'template' and 'max_tokens'"
        )

    template = definition["template"]
    max_tokens = definition["max_tokens"]
    if not isinstance(template, str) or not template.strip():
        raise _invalid_prompt_definition(path, "template must be a non-empty string")
    if (
        not isinstance(max_tokens, int)
        or isinstance(max_tokens, bool)
        or max_tokens <= 0
    ):
        raise _invalid_prompt_definition(path, "max_tokens must be a positive integer")

    try:
        prompt_template = PromptTemplate.from_template(template)
    except ValueError as error:
        raise _invalid_prompt_definition(path, "template syntax is invalid") from error

    if set(prompt_template.input_variables) != REQUIRED_TEMPLATE_VARIABLES:
        raise _invalid_prompt_definition(
            path, "template must use only '{locale_instruction}'"
        )

    return prompt_template, max_tokens


def load_generation_profiles(
    directory: Path = PROMPT_TEMPLATE_DIRECTORY,
) -> Dict[str, Tuple[PromptTemplate, int]]:
    return {
        mode: load_prompt_definition(directory / filename)
        for mode, filename in PROMPT_FILES.items()
    }


GENERATION_PROFILES = load_generation_profiles()
WORD_PROMPT_TEMPLATE, MAX_WORD_TOKENS = GENERATION_PROFILES["word"]
TEXT_PROMPT_TEMPLATE, MAX_TEXT_TOKENS = GENERATION_PROFILES["text"]
PATH_PROMPT_TEMPLATE, MAX_PATH_TOKENS = GENERATION_PROFILES["path"]
VERIFICATION_PROMPT_TEMPLATE, MAX_VERIFICATION_TOKENS = GENERATION_PROFILES["verification"]


def normalize_locale(locale: object) -> str:
    return locale if isinstance(locale, str) and locale in SUPPORTED_LOCALES else DEFAULT_LOCALE


def get_generation_profile(mode: str, locale: str = DEFAULT_LOCALE) -> Tuple[str, int]:
    try:
        prompt_template, max_tokens = GENERATION_PROFILES[mode]
    except KeyError as error:
        raise ValueError("Generation mode must be 'word', 'text', or 'path'.") from error

    locale_instruction = LOCALE_INSTRUCTIONS[normalize_locale(locale)]
    return prompt_template.format(locale_instruction=locale_instruction), max_tokens


def get_verification_profile(locale: str = DEFAULT_LOCALE) -> Tuple[str, int]:
    locale_instruction = LOCALE_INSTRUCTIONS[normalize_locale(locale)]
    return (
        VERIFICATION_PROMPT_TEMPLATE.format(locale_instruction=locale_instruction),
        MAX_VERIFICATION_TOKENS,
    )
