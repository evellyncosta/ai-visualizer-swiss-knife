## Purpose

Provide a focused token-probability visualizer backed by the OpenAI API without exposing provider credentials or configuration in the browser.

## ADDED Requirements

### Requirement: Server-side OpenAI configuration
The application SHALL authenticate direct requests to the OpenAI API using `OPENAI_API_KEY` loaded from its server environment. The application SHALL provide an `.env.example` template that documents the required variable, and the actual `.env` file containing credentials SHALL be excluded from version control.

#### Scenario: Valid server configuration
- **WHEN** the application starts with a non-empty `OPENAI_API_KEY` available through its environment
- **THEN** it SHALL be able to issue generation requests to the OpenAI API without receiving credentials from the browser

#### Scenario: Missing server configuration
- **WHEN** a generation request is made and `OPENAI_API_KEY` is unavailable or empty
- **THEN** the application SHALL return a configuration error that does not expose credentials or internal environment values

### Requirement: Credential-free generation interface
The generation interface SHALL accept a prompt and generation controls only, and SHALL NOT display or transmit an OpenAI API key, Azure API key, Azure endpoint, or any provider endpoint.

#### Scenario: Generate from the focused interface
- **WHEN** a user submits a non-empty prompt in the local visualizer
- **THEN** the browser SHALL request generation without including provider credentials or endpoints in the request payload

#### Scenario: Azure configuration is absent
- **WHEN** a user views the local visualizer
- **THEN** no Azure endpoint or API-key input SHALL be available

### Requirement: OpenAI token-probability response
For a valid generation request, the application SHALL use the direct OpenAI API to generate a text continuation and return the selected output tokens with their probabilities and the requested top alternative token probabilities in the existing visualization response shape.

#### Scenario: Successful probability generation
- **WHEN** the OpenAI API returns a completion with token log probabilities
- **THEN** the generation response SHALL contain the completion text and one probability record for each returned output token

#### Scenario: Alternative token display data
- **WHEN** a token probability record is returned
- **THEN** it SHALL include the selected token, its probability, and the available top alternative tokens with their probabilities

#### Scenario: Provider request failure
- **WHEN** the OpenAI API rejects or cannot complete a generation request
- **THEN** the application SHALL return an error response and SHALL NOT disclose the configured API key
