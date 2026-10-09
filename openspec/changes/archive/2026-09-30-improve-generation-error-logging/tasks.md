## 1. Request correlation and lifecycle records

- [x] 1.1 Add an opaque request identifier and elapsed-time measurement to `POST /api/generate`; include the identifier in all endpoint log records and in failed-response `X-Request-ID` headers, verified by route tests.
- [x] 1.2 Emit compact success records containing only approved generation settings, status, request identifier, and duration; verify captured logs contain no prompt or generated text.

## 2. Failure diagnostics and data protection

- [x] 2.1 Add safe logs for handled validation, configuration, and invalid-provider-result failures with stable safe error codes; use ERROR for HTTP 5xx and WARNING for HTTP 4xx while preserving status codes and JSON error payloads; verify each path with route tests.
- [x] 2.2 Add exception logging with traceback for unexpected failures while preserving the generic 502 client response; verify captured logs include the traceback and correlation identifier.
- [x] 2.3 Ensure error codes and error logging never write API keys, authorization headers, raw prompts, raw provider payloads, or exception messages that may contain them; verify with sentinel-sensitive test inputs.

## 3. Verification

- [x] 3.1 Run the complete Python test suite and verify all existing API contracts plus the new logging, level, safe-code, and correlation scenarios pass.
- [x] 3.2 Trigger a known generation failure in the intended runtime process and verify its process-log destination retains the request identifier and safe diagnostic record.
