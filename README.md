# Playwright BDD

API test automation project using Playwright, TypeScript, and `playwright-bdd`.

## Installation

Install the project dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Environment Setup

Create a .env file in the root directory to store your Trello API credentials outside the repository:

```bash
TRELLO_API_KEY=your_actual_api_key
TRELLO_API_TOKEN=your_actual_api_token
```

## Run Tests

Generate the Playwright tests from the BDD feature files:

```bash
npx bddgen
```

Run the tests:

```bash
npx playwright test
```

## View Test Report

After running the tests, open the HTML report with:

```bash
npx playwright show-report
```

## Project Structure

```text
features/               # BDD feature files (.feature)
steps/                  # Step definitions and API clients
├── api/                # Trello API client & response types
├── fixtures.ts         # Custom BDD fixtures injecting TrelloApiClient
└── create-card.steps.ts# Step implementations
tests/                  # Generated Playwright tests (.ptest.ts)
.env                    # Environment credentials (git-ignored)
playwright.config.ts    # Playwright and BDD configuration
```
