## Context

The generation route currently maps `ValueError`, `RuntimeError`, and all other exceptions to HTTP responses, but it emits no application logs. The broad unexpected-error branch deliberately hides the exception from the client, so the server-side record is the only safe place to retain diagnostic details. See `proposal.md` for the motivation and `specs/generation-error-observability/spec.md` for the behavioral contract.

## Goals / Non-Goals

**Goals:**

- Make every generation request traceable from its HTTP response to a concise application log trail.
- Record enough safe metadata to distinguish input/configuration, provider-result, and unexpected execution failures.
- Preserve the current JSON response bodies and status mapping.

**Non-Goals:**

- Adding a third-party observability service, distributed tracing backend, or persistent request store.
- Logging prompts, generated text, token probabilities, provider payloads, or secrets.
- Redesigning the endpoint's validation or its HTTP status semantics.

## Decisions

### Use an application-generated request ID and a response header

The route will create a UUID-compatible opaque ID at the start of each request, include it in all route logs, and attach it as `X-Request-ID` on error responses. This lets support correlate a browser-visible failure with server logs without requiring a prompt or user identity.

An inbound client-provided ID is not accepted for the first iteration. Trusting it would require format validation and collision/abuse handling, while application-generated IDs meet the diagnostic need.

### Use standard application logging with explicit safe fields and severity

The implementation will use the existing Python/Flask logging path and emit structured, stable key-value context: request ID, outcome/status, safe error code, exception class, mode, normalized locale, `top_k`, temperature, and elapsed milliseconds. Successful requests use an informational completion record; rejected 4xx requests use WARNING; all 5xx failures use ERROR. Unexpected failures use exception logging so the traceback is captured.

Structured key-value messages avoid a new dependency and remain readable by local development and typical process-log collectors. JSON logging was considered, but is unnecessary for the current single-process Flask application and could be introduced later without changing the correlation contract.

### Map known application failures to explicit safe error codes

The endpoint will map the known error messages produced by its own configuration, tokenizer, provider-metadata, and response-validation checks to fixed codes. The code is logged instead of the exception message, which makes a 500 actionable without risking sensitive provider content. Unclassified runtime failures use `runtime_error`; unexpected exceptions use `unexpected_exception`.

Logging the exception message, even only for known failures, was rejected because a future provider or library change can place prompt or credential material in it. Reusing only `RuntimeError` was rejected because it cannot distinguish the operational causes currently handled by the endpoint.

### Separate safe client errors from diagnostic server logs

The existing client response messages remain intact. Logging will avoid exception messages and raw provider objects in the generic provider/unexpected paths because either can carry user content or credentials. The exception class plus approved context is sufficient for first-line diagnosis; a traceback remains permitted only for unexpected failures because its stack frames are application-controlled.

### Measure the route boundary

Elapsed time will be measured from entry to exit of `POST /api/generate`, covering validation, tokenization, provider invocation, response adaptation, and serialization. This makes slow failures distinguishable from immediate configuration or validation failures without separate instrumentation in each helper.

## Risks / Trade-offs

- [Tracebacks can include sensitive local values if future code interpolates them into exception text] -> Log safe structured fields and avoid formatting exception messages or provider payloads into records; review new error handling with this boundary in mind.
- [Process configuration can discard application stderr/stdout] -> Verify logs in the actual development and deployment process and document the expected process-log destination if needed.
- [A generated ID alone cannot link multiple services] -> Keep the header contract so a later proxy or tracing system can propagate it without changing clients.
- [An unmapped known message is less specific] -> Use `runtime_error` as a safe fallback and add an explicit code whenever a new handled error is introduced.
- [Higher success-log volume] -> Keep records compact and at INFO level so deployments can tune verbosity through standard logger configuration.

## Migration Plan

1. Add request lifecycle and error logging while preserving response payloads and status codes.
2. Add tests that inspect captured logs and headers, including redaction cases.
3. Run the test suite and manually trigger a known failure in the target process to confirm its log collector retains the record.
4. Roll back by removing the added logging and header behavior; no persisted data or client migration is involved.
