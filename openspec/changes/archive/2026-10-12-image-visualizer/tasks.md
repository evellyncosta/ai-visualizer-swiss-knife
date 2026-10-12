## 1. Backend image boundary

- [x] 1.1 Add isolated server-side configuration for the remote image endpoint and optional token, and verify missing configuration produces a safe unavailable response.
- [x] 1.2 Replace the remote HTTP implementation with `huggingface_hub.InferenceClient`, validate a non-empty prompt, and verify a mocked client uses no OpenAI client or configuration.
- [x] 1.3 Serialize and validate the image returned by `InferenceClient.text_to_image`, including byte limits and image contents, and verify invalid image results are rejected safely.
- [x] 1.4 Return a binary image response to the browser and include the redacted Hugging Face `error`/`code` contract for timeout and rejection failures without exposing the prompt, endpoint URL, or token.

## 2. Image Visualizer interface

- [x] 2.1 Add the dedicated Image Visualizer page, script, and localized UI labels for prompt entry, loading, error, result, and download, and verify it renders independently of text visualizers.
- [x] 2.2 Implement generation from the page using the dedicated API route, conversion of the successful response to a temporary object URL, and result display, and verify the displayed image matches a mocked binary response.
- [x] 2.3 Add browser download of the currently displayed image with a MIME-compatible file extension and object-URL cleanup when replacing it, and verify the downloaded content is the generated image.
- [x] 2.4 Add the Image Visualizer card, route, and static-site generation mapping, and verify all existing modes retain their current destinations while the new card opens its dedicated page.

## 3. Verification and handoff

- [x] 3.1 Update backend tests for `InferenceClient` configuration, authentication, success, invalid response, timeout, provider-message redaction, and verify the full Python test suite passes.
- [x] 3.2 Perform browser verification for valid generation, loading, remote failure, image display, and download, and record the expected manual check or automated coverage.
- [x] 3.3 Document the Hugging Face image and error contracts plus required server environment variables, and verify the documentation instructs users to keep all provider credentials out of browser configuration.
