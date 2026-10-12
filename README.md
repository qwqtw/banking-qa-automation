# Banking UI & API Test Automation Framework

A Playwright + TypeScript quality engineering project for testing a simplified banking application across UI, REST API, accessibility, and end-to-end workflows.

The framework demonstrates scalable test automation practices including cross-browser execution, parallel testing, test-data isolation, API-driven setup, CI integration, and automated reporting.

## Tech Stack

- Playwright
- TypeScript
- React
- Node.js / Express
- REST APIs
- GitHub Actions
- Google Cloud Build
- Docker
- axe-core
- HTML Test Reporting

## Test Coverage

### UI Automation
- Banking dashboard validation
- Account balance verification
- Fund transfer workflow
- Transaction history validation
- Insufficient funds validation
- Invalid transfer amount validation

### API Automation
- GET account details
- POST fund transfers
- GET transaction history
- HTTP status validation
- JSON response validation
- Backend state verification

### End-to-End Testing

The main E2E scenario validates the banking workflow across both frontend and backend layers:

1. Dynamically create an isolated test account through the API
2. Open the account through the banking UI
3. Execute a fund transfer in the browser
4. Validate the updated balance in the UI
5. Query the REST API to verify the backend balance
6. Verify that the transaction record was created

## Parallel Test Execution

The test suite runs Playwright tests in parallel.

Stateful banking tests use dynamically provisioned accounts so that each test receives isolated test data.

This prevents race conditions between concurrent browser workers.

Example:

```text
Chromium test  -> Account 100
Firefox test   -> Account 101
WebKit test    -> Account 102