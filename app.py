from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_cors import CORS
import os
import math
import re
import time
import uuid
import json
from typing import Dict, List, Tuple
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from openai import OpenAI
import tiktoken

from prompts import (
    DEFAULT_LOCALE,
    get_generation_profile,
    get_verification_profile,
    normalize_locale,
)

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

MODEL_NAME = "gpt-5.4-nano"
VERIFICATION_MODEL_NAME = "gpt-5.5"
WORD_PATTERN = re.compile(r"[^\W\d_]+(?:[-'][^\W\d_]+)*$", re.UNICODE)
MARKDOWN_PATTERNS = (
    re.compile(r"```"),
    re.compile(r"(?m)^\s{0,3}#{1,6}\s+"),
    re.compile(r"(?m)^\s*(?:[-*+]\s+|\d+[.)]\s+)"),
    re.compile(r"(?m)^\s*>\s?"),
    re.compile(r"(?:\*\*|__|`|\[[^\]]+\]\([^)]*\))"),
)
VALUE_ERROR_CODES = {
    "Request body must be a JSON object": "request_body_invalid",
    "Generation mode must be a string.": "generation_mode_invalid",
    "Generation mode must be 'word', 'text', or 'path'.": "generation_mode_invalid",
    "Generation settings must be numeric.": "generation_settings_invalid",
    "top_k must be between 0 and 20.": "generation_settings_invalid",
    "temperature must be between 0 and 2.": "generation_settings_invalid",
    "Prompt is required": "prompt_missing",
    "Path response prefix is only supported in path mode.": "path_response_prefix_invalid",
    "Path response prefix must be a string.": "path_response_prefix_invalid",
}
RUNTIME_ERROR_CODES = {
    "OpenAI API key is not configured on the server.": "openai_api_key_not_configured",
    "No official tokenizer encoding is configured for the selected OpenAI model.": (
        "tokenizer_configuration_unsupported"
    ),
    "OpenAI did not return token probabilities.": "token_probabilities_missing",
    "OpenAI did not return a valid next word.": "generated_word_invalid",
    "OpenAI did not return a valid text response.": "generated_text_invalid",
    "OpenAI did not return plain text.": "plain_text_invalid",
    "OpenAI did not return a valid path continuation.": "generated_path_invalid",
    "OpenAI did not return a verification message.": "verification_message_missing",
}


def get_model_response(
    prompt: str,
    top_k: int = 5,
    temperature: float = 0.0,
    mode: str = "word",
    locale: str = DEFAULT_LOCALE,
    assistant_prefix: str = "",
) -> Tuple[str, List[Dict], List[Dict]]:
    """
    Returns:
      response_text: str
      token_probs: List[Dict] with selected provider output tokens and probabilities
      prompt_tokens: List[Dict] with tokenizer ids and raw bytes for the user context
          {
            "selected_token": str,
            "selected_prob": float,
            "top_logprobs": List[{"token": str, "probability": float}]
          }
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OpenAI API key is not configured on the server.")

    prompt_tokens = tokenize_prompt(prompt)

    system_prompt, max_tokens = get_generation_profile(mode, locale)
    model = ChatOpenAI(
        model=MODEL_NAME,
        temperature=temperature,
        max_tokens=max_tokens,
        logprobs=True,
        top_logprobs=top_k,
        reasoning_effort="none",
    )
    path_context = prompt + assistant_prefix if mode == "path" else prompt
    messages = [
        {"role": "developer", "content": system_prompt},
        {"role": "user", "content": path_context},
    ]
    response = model.invoke(messages)

    response_text = response.content
    logprobs = response.response_metadata.get("logprobs")

    if not isinstance(response_text, str) or not logprobs or not logprobs.get("content"):
        raise RuntimeError("OpenAI did not return token probabilities.")

    token_probs = []
    for token_info in logprobs["content"]:
        selected_token = token_info["token"]
        selected_prob = math.exp(token_info["logprob"])

        top_items = []
        for lp in token_info["top_logprobs"]:
            top_items.append({
                "token": lp["token"],
                "probability": math.exp(lp["logprob"])
            })

        token_probs.append({
            "selected_token": selected_token,
            "selected_prob": selected_prob,
            "top_logprobs": top_items
        })

    validate_response(response_text, token_probs, mode)
    return response_text, token_probs, prompt_tokens


def tokenize_prompt(prompt: str) -> List[Dict]:
    """Represent user-context tokens without assuming each one is valid UTF-8 alone."""
    try:
        encoding = tiktoken.encoding_for_model(MODEL_NAME)
    except KeyError as error:
        raise RuntimeError(
            "No official tokenizer encoding is configured for the selected OpenAI model."
        ) from error

    return [
        {"id": token_id, "bytes": list(encoding.decode_single_token_bytes(token_id))}
        for token_id in encoding.encode(prompt)
    ]


def validate_next_word(response_text: str, token_probs: List[Dict]) -> None:
    """Reject output that cannot be displayed as one faithful lexical word."""
    raw_tokens = "".join(token["selected_token"] for token in token_probs)
    word = response_text[1:] if response_text.startswith(" ") else response_text

    if (
        raw_tokens != response_text
        or not word
        or response_text != response_text.rstrip()
        or response_text.startswith(("\n", "\t"))
        or not WORD_PATTERN.fullmatch(word)
    ):
        raise RuntimeError("OpenAI did not return a valid next word.")


def validate_text_response(response_text: str, token_probs: List[Dict]) -> None:
    """Keep text-output tokens faithful while rejecting Markdown formatting."""
    raw_tokens = "".join(token["selected_token"] for token in token_probs)
    if raw_tokens != response_text or not response_text.strip():
        raise RuntimeError("OpenAI did not return a valid text response.")
    if any(pattern.search(response_text) for pattern in MARKDOWN_PATTERNS):
        raise RuntimeError("OpenAI did not return plain text.")


def validate_path_continuation(response_text: str, token_probs: List[Dict]) -> None:
    """Accept a faithful, non-empty provider token sequence for a path segment."""
    if (
        not token_probs
        or not response_text
        or "".join(token["selected_token"] for token in token_probs) != response_text
    ):
        raise RuntimeError("OpenAI did not return a valid path continuation.")


def validate_response(response_text: str, token_probs: List[Dict], mode: str) -> None:
    if mode == "word":
        validate_next_word(response_text, token_probs)
        return
    if mode == "text":
        validate_text_response(response_text, token_probs)
        return
    if mode == "path":
        validate_path_continuation(response_text, token_probs)
        return
    raise ValueError("Generation mode must be 'word', 'text', or 'path'.")


def _response_value(value, name):
    return value.get(name) if isinstance(value, dict) else getattr(value, name, None)


def normalize_web_sources(provider_response) -> List[Dict]:
    sources = []
    def add_source(source):
        url = _response_value(source, "url")
        title = _response_value(source, "title") or url
        if url and not any(item["url"] == url for item in sources):
            sources.append({
                "title": title,
                "url": url,
                "relation": "evidence",
                "retrieved_at": time.strftime("%Y-%m-%d", time.gmtime()),
            })

    for output in _response_value(provider_response, "output") or []:
        action = _response_value(output, "action")
        for source in (_response_value(action, "sources") if action else []) or []:
            add_source(source)
        for content in _response_value(output, "content") or []:
            for annotation in _response_value(content, "annotations") or []:
                add_source(annotation)
    return sources


def get_verification_result(prompt: str, response: str, locale: str) -> Dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OpenAI API key is not configured on the server.")

    system_prompt, max_tokens = get_verification_profile(locale)
    provider_response = OpenAI(api_key=api_key).responses.create(
        model=VERIFICATION_MODEL_NAME,
        tools=[{"type": "web_search"}],
        tool_choice="required",
        reasoning={"effort": "medium"},
        instructions=system_prompt,
        input=json.dumps({"prompt": prompt, "response": response}),
        max_output_tokens=max_tokens,
        store=False,
    )
    sources = normalize_web_sources(provider_response)
    content = _response_value(provider_response, "output_text")
    if not isinstance(content, str) or not content.strip():
        raise RuntimeError("OpenAI did not return a verification message.")
    return {"message": content, "sources": sources}


def get_generation_settings(data: Dict) -> Tuple[int, float]:
    try:
        top_k = int(data.get("top_k", 5))
        temperature = float(data.get("temperature", 0.0))
    except (TypeError, ValueError) as error:
        raise ValueError("Generation settings must be numeric.") from error

    if not 0 <= top_k <= 20:
        raise ValueError("top_k must be between 0 and 20.")
    if not 0 <= temperature <= 2:
        raise ValueError("temperature must be between 0 and 2.")

    return top_k, temperature


def get_generation_locale(data: Dict) -> str:
    return normalize_locale(data.get("locale"))


def get_generation_error_code(error: Exception) -> str:
    """Classify known application failures without exposing exception text in logs."""
    if isinstance(error, ValueError):
        return VALUE_ERROR_CODES.get(str(error), "request_invalid")
    if isinstance(error, RuntimeError):
        return RUNTIME_ERROR_CODES.get(str(error), "runtime_error")
    return "unexpected_exception"


def log_generation_outcome(
    *,
    request_id: str,
    status: int,
    outcome: str,
    mode: str,
    locale: str,
    top_k: object,
    temperature: object,
    started_at: float,
    error: Exception | None = None,
    include_traceback: bool = False,
) -> None:
    """Log approved generation metadata without request, response, or error content."""
    duration_ms = round((time.perf_counter() - started_at) * 1000)
    context = (
        "generation_request outcome=%s request_id=%s status=%s error_code=%s "
        "exception_type=%s mode=%s locale=%s top_k=%s temperature=%s duration_ms=%s"
    )
    values = (
        outcome,
        request_id,
        status,
        get_generation_error_code(error) if error else "none",
        type(error).__name__ if error else "none",
        mode,
        locale,
        top_k,
        temperature,
        duration_ms,
    )

    if include_traceback:
        # Keep the traceback but replace the original exception instance, whose
        # message can contain provider data or credentials.
        app.logger.error(
            context,
            *values,
            exc_info=(Exception, Exception(), error.__traceback__),
        )
    elif error:
        log_method = app.logger.warning if status < 500 else app.logger.error
        log_method(context, *values)
    else:
        app.logger.info(context, *values)


def generation_error_response(message: str, status: int, request_id: str):
    response = jsonify({"error": message})
    response.status_code = status
    response.headers["X-Request-ID"] = request_id
    return response


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/tokens')
def token_visualizer():
    return render_template('tokens.html')


@app.route('/phrase')
def phrase_visualizer():
    return redirect(url_for('text_visualizer'))


@app.route('/text')
def text_visualizer():
    return render_template('text.html')


@app.route('/hallucination-path')
def hallucination_path():
    return render_template('hallucination-path.html')


@app.route('/api/generate', methods=['POST'])
def generate():
    request_id = str(uuid.uuid4())
    started_at = time.perf_counter()
    mode = "unknown"
    locale = DEFAULT_LOCALE
    top_k = None
    temperature = None

    try:
        data = request.get_json(silent=True) or {}
        if not isinstance(data, dict):
            raise ValueError("Request body must be a JSON object")

        prompt = data.get('prompt', '')
        assistant_prefix = data.get('response_prefix', '')
        requested_mode = data.get('mode', 'word')
        if not isinstance(requested_mode, str):
            raise ValueError("Generation mode must be a string.")
        mode = requested_mode if requested_mode in {"word", "text", "path"} else "invalid"
        top_k, temperature = get_generation_settings(data)
        locale = get_generation_locale(data)
        
        if not prompt:
            raise ValueError("Prompt is required")
        if not isinstance(assistant_prefix, str):
            raise ValueError("Path response prefix must be a string.")
        if requested_mode != "path" and assistant_prefix:
            raise ValueError("Path response prefix is only supported in path mode.")
            
        response_text, token_probs, prompt_tokens = get_model_response(
            prompt, top_k, temperature, requested_mode, locale, assistant_prefix
        )
        
        response = jsonify({
            'text': response_text,
            'tokenProbs': token_probs,
            'promptTokens': prompt_tokens,
        })
        log_generation_outcome(
            request_id=request_id,
            status=200,
            outcome="success",
            mode=mode,
            locale=locale,
            top_k=top_k,
            temperature=temperature,
            started_at=started_at,
        )
        return response
        
    except ValueError as error:
        log_generation_outcome(
            request_id=request_id,
            status=400,
            outcome="handled_error",
            mode=mode,
            locale=locale,
            top_k=top_k,
            temperature=temperature,
            started_at=started_at,
            error=error,
        )
        return generation_error_response(str(error), 400, request_id)
    except RuntimeError as error:
        log_generation_outcome(
            request_id=request_id,
            status=500,
            outcome="handled_error",
            mode=mode,
            locale=locale,
            top_k=top_k,
            temperature=temperature,
            started_at=started_at,
            error=error,
        )
        return generation_error_response(str(error), 500, request_id)
    except Exception as error:
        log_generation_outcome(
            request_id=request_id,
            status=502,
            outcome="unexpected_error",
            mode=mode,
            locale=locale,
            top_k=top_k,
            temperature=temperature,
            started_at=started_at,
            error=error,
            include_traceback=True,
        )
        return generation_error_response('OpenAI generation request failed.', 502, request_id)


@app.route('/api/verify-hallucination', methods=['POST'])
def verify_hallucination():
    request_id = str(uuid.uuid4())
    started_at = time.perf_counter()
    locale = DEFAULT_LOCALE
    try:
        data = request.get_json(silent=True) or {}
        if not isinstance(data, dict):
            raise ValueError("Request body must be a JSON object")
        prompt = data.get("prompt")
        response = data.get("response")
        locale = get_generation_locale(data)
        if not isinstance(prompt, str) or not prompt.strip():
            raise ValueError("Prompt is required")
        if not isinstance(response, str) or not response.strip():
            raise ValueError("Response is required")
        result = get_verification_result(prompt, response, locale)
        http_response = jsonify(result)
        log_generation_outcome(
            request_id=request_id, status=200, outcome="success", mode="verification",
            locale=locale, top_k="none", temperature=0.0, started_at=started_at,
        )
        return http_response
    except ValueError as error:
        log_generation_outcome(
            request_id=request_id, status=400, outcome="handled_error", mode="verification",
            locale=locale, top_k="none", temperature=0.0, started_at=started_at, error=error,
        )
        return generation_error_response(str(error), 400, request_id)
    except RuntimeError as error:
        log_generation_outcome(
            request_id=request_id, status=500, outcome="handled_error", mode="verification",
            locale=locale, top_k="none", temperature=0.0, started_at=started_at, error=error,
        )
        return generation_error_response(str(error), 500, request_id)
    except Exception as error:
        log_generation_outcome(
            request_id=request_id, status=502, outcome="unexpected_error", mode="verification",
            locale=locale, top_k="none", temperature=0.0, started_at=started_at,
            error=error, include_traceback=True,
        )
        return generation_error_response("OpenAI verification request failed.", 502, request_id)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
