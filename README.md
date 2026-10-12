# Banking UI & API Test Automation Framework

A Playwright + TypeScript quality engineering project for testing a simplified banking application across UI, REST API, accessibility, and end-to-end workflows.

The framework demonstrates scalable test automation practices including cross-browser execution, parallel testing, test-data isolation, API-driven setup, CI integration, containerized execution, and automated reporting.

## Tech Stack

- Playwright
- TypeScript
- React
- Node.js / Express
- REST APIs
- GitHub Actions
- Docker
- Google Cloud Build configuration
- axe-core
- Playwright HTML Reporting

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
- API-driven test-data provisioning

### End-to-End Testing

The main E2E scenario validates a banking workflow across both frontend and backend layers:

1. Dynamically create an isolated test account through the API
2. Open the account through the banking UI
3. Execute a fund transfer in the browser
4. Validate the updated balance in the UI
5. Query the REST API to verify the backend balance
6. Verify that the transaction record was created

## Parallel Test Execution

The test suite runs Playwright tests in parallel.

Stateful banking tests use dynamically provisioned accounts so that each test receives isolated test data.

This prevents race conditions and shared-state collisions between concurrent workers.

Example:

```text
Chromium happy path      -> Account 100
Chromium negative test   -> Account 101
Firefox happy path       -> Account 102
Firefox negative test    -> Account 103
WebKit happy path        -> Account 104
WebKit negative test     -> Account 105
```

This allows stateful E2E scenarios to execute safely in parallel.

## Cross-Browser Testing

UI tests execute across:

- Chromium
- Firefox
- WebKit

API tests run in a dedicated Playwright API project without unnecessary browser execution.

## Accessibility Testing

Accessibility checks are implemented using:

- `@axe-core/playwright`
- WCAG 2.0 A
- WCAG 2.0 AA

The suite checks for serious and critical accessibility violations.

## Project Structure

```text
banking-qa-automation/
│
├── banking-ui/
│   └── React banking application
│
├── mock-api/
│   └── Express banking REST API
│
├── pages/
│   ├── BankingPage.ts
│   ├── CartPage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
│
├── tests/
│   ├── ui/
│   ├── api/
│   └── accessibility/
│
├── utils/
│   └── testData.ts
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── Dockerfile
├── .dockerignore
├── playwright.config.ts
├── cloudbuild.yaml
└── package.json
```

## Test Tags

Tests are organized using tags:

```text
@smoke
@regression
@api
@e2e
@a11y
```

Examples:

```bash
npm run test:smoke
npm run test:regression
npm run test:api
npm run test:a11y
```

## Running Tests Locally

Install root dependencies:

```bash
npm install
```

Install banking UI dependencies:

```bash
cd banking-ui
npm install
cd ..
```

Install Playwright browsers:

```bash
npx playwright install
```

Run the complete suite:

```bash
npx playwright test
```

Run smoke tests:

```bash
npm run test:smoke
```

Run regression tests:

```bash
npm run test:regression
```

Run API tests:

```bash
npm run test:api
```

Run accessibility tests:

```bash
npm run test:a11y
```

Open the HTML report:

```bash
npx playwright show-report
```

## Automated Test Reporting

Playwright is configured to retain diagnostic artifacts for failed tests:

- Screenshots
- Video recordings
- Trace files
- HTML reports

These artifacts support test failure analysis and troubleshooting.

## CI/CD

### GitHub Actions

The automated Playwright suite is integrated with GitHub Actions.

Tests run automatically on:

- Pushes to `main`
- Pull requests targeting `main`

The workflow:

1. Checks out the repository
2. Sets up Node.js
3. Installs root dependencies
4. Installs banking UI dependencies
5. Installs Playwright browser dependencies
6. Starts the required application services
7. Executes the Playwright test suite
8. Uploads the Playwright HTML report as a workflow artifact

The GitHub Actions pipeline has been successfully executed against the full automated test suite.

## Docker

The test framework supports containerized execution using Docker.

Build the test image:

```bash
docker build -t banking-qa-automation .
```

Run the complete Playwright suite inside the container:

```bash
docker run --rm banking-qa-automation
```

The Docker environment includes the required Playwright browser dependencies and executes the same UI, API, E2E, and accessibility suites used locally and in CI.

## Google Cloud Build

A `cloudbuild.yaml` configuration is included for running the Playwright automation suite in Google Cloud Build.

The configuration defines cloud-based dependency installation and automated test execution using a Playwright container image.

Cloud Build execution requires a Google Cloud project with billing enabled.

## Quality Engineering Practices Demonstrated

This project demonstrates:

- Reusable Page Object Model design
- UI automation
- REST API automation
- Hybrid UI/API end-to-end testing
- Positive and negative testing
- Smoke and regression suites
- Cross-browser testing
- Parallel test execution
- Parallel-safe test-data isolation
- Dynamic API-driven test-data provisioning
- Accessibility testing
- WCAG validation
- Automated failure diagnostics
- GitHub Actions CI integration
- Docker-based test execution
- Google Cloud Build pipeline configuration