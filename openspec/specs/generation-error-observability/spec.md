# generation-error-observability Specification

## Purpose

Permitir diagnosticar falhas de geração de forma correlacionável, útil e segura, sem expor dados sensíveis de usuários ou da configuração do provedor.

## Requirements

### Requirement: Correlation identifier for generation failures
The system SHALL assign an opaque correlation identifier to each request to the generation endpoint. Every failed generation response SHALL include that identifier in the `X-Request-ID` response header, and the log records for that request SHALL include the same identifier.

#### Scenario: Client reports a failed generation
- **WHEN** a generation request ends with an HTTP error response
- **THEN** the response includes `X-Request-ID` and an operator can locate the associated log records using its value

### Requirement: Safe failure logging
The system SHALL emit an application log for every failed generation request. The record SHALL contain the correlation identifier, HTTP status, a documented safe error code, exception type, generation mode, normalized locale, requested `top_k`, temperature, and elapsed duration. Server failures with HTTP 5xx SHALL use the ERROR level, while rejected client requests with HTTP 4xx SHALL use the WARNING level. Unexpected failures SHALL include traceback information.

#### Scenario: Known generation failure
- **WHEN** generation fails due to a handled configuration, validation, or invalid provider-result error
- **THEN** the application emits a log record with the failure context, a safe error code identifying the handled cause, and exception information

#### Scenario: Server-side handled generation failure
- **WHEN** generation fails with a handled HTTP 5xx response
- **THEN** the application emits the failure record at ERROR level

#### Scenario: Rejected client request
- **WHEN** generation is rejected with an HTTP 4xx response
- **THEN** the application emits the failure record at WARNING level

#### Scenario: Unexpected generation failure
- **WHEN** an unhandled exception occurs while processing a generation request
- **THEN** the application emits an error log record that includes the exception traceback and safe request context

### Requirement: Sensitive data exclusion from observability logs
The system SHALL NOT write the raw user prompt, `OPENAI_API_KEY`, authorization headers, or raw provider request or response bodies to application logs generated for the generation endpoint.

#### Scenario: Provider error contains secret-like text
- **WHEN** an exception message or provider payload could contain credentials or request content
- **THEN** the application log uses only the approved safe context and does not record that message or payload verbatim

### Requirement: Safe diagnostic error codes
The system SHALL classify handled generation failures into stable, safe error codes that identify the failure class without reproducing an exception message or user/provider content. At minimum, it SHALL distinguish missing OpenAI configuration, unsupported tokenizer configuration, missing token-probability data, invalid generated word, invalid generated text, invalid plain-text formatting, and invalid generation settings.

#### Scenario: Missing OpenAI configuration
- **WHEN** a generation request fails because `OPENAI_API_KEY` is unavailable
- **THEN** the failure log contains `error_code=openai_api_key_not_configured` and does not contain the key value

### Requirement: Generation outcome logging
The system SHALL emit an application log record for each successful generation request that includes the correlation identifier, successful HTTP status, normalized generation settings, and elapsed duration, without logging the prompt or generated text.

#### Scenario: Successful generation
- **WHEN** the generation endpoint returns a successful response
- **THEN** an operator can find a completion log record by its correlation identifier without exposing request or response content

