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
features/       # BDD feature files
steps/          # Step definitions
feature-gen/    # Generated Playwright tests
playwright.config.ts
```
