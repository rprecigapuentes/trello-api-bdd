# Trello API BDD

[![CI](https://github.com/rprecigapuentes/trello-api-bdd/actions/workflows/ci.yml/badge.svg)](https://github.com/rprecigapuentes/trello-api-bdd/actions/workflows/ci.yml)

BDD test suite for the [Trello REST API](https://developer.atlassian.com/cloud/trello/rest/) using Playwright, TypeScript, `playwright-bdd` and Zod schema validation, organized as an **npm workspaces monorepo**. The active suite lives in the `trello-service-bdd` workspace.

Team project of the API Testing module, Jalasoft Software Automation Testing Bootcamp (2026). See [Results and contributions](#results-and-contributions).

---

## Tech Stack & Tooling

- **Test Runner & Framework:** [Playwright Test](https://playwright.dev/) & [playwright-bdd](https://vitalets.github.io/playwright-bdd/)
- **Architecture:** npm Workspaces Monorepo
- **Language:** TypeScript
- **Logging:** [LogTape](https://logtape.org/) (Structured async console & file logging)
- **Code Quality & Formatting:** ESLint (Flat Config) & Prettier
- **Git Hooks:** Husky & lint-staged

--

## Installation

Install dependencies for all workspaces (run from the **repo root**, not from inside a workspace):

```bash
npm install
```

Install Playwright browsers for the `trello-service-bdd` workspace:

```bash
npx playwright install --with-deps
```

## Environment Setup

Create a `.env` file inside `trello-service-bdd/` (next to `playwright.config.ts`) to store your Trello API credentials outside the repository:

```bash
TRELLO_API_KEY=your_actual_api_key
TRELLO_API_TOKEN=your_actual_api_token
```

## Run Tests

All commands below are run from the **repo root** using the `-w` (`--workspace`) flag.

Generate the Playwright tests from the BDD feature files:

```bash
npm run bddgen -w trello-service-bdd
```

Run the tests (this also runs `bddgen` first):

```bash
npm run test -w trello-service-bdd
```

Run type checking only, without executing tests:

```bash
npm run typecheck -w trello-service-bdd
```

Pass extra flags through to Playwright (e.g. headed mode, a single file):

```bash
npm run test -w trello-service-bdd -- --headed
npm run test -w trello-service-bdd -- features/boards.feature
```

Alternatively, `cd trello-service-bdd` and drop the `-w` flag — the commands behave the same either way.

## View Test Report

After running the tests, open the HTML report with:

```bash
npm run report -w trello-service-bdd
```

## Running from VS Code (Test Explorer)

Since the Playwright config lives inside `trello-service-bdd/` rather than the repo root, point the VS Code extension at it via `.vscode/settings.json`:

```json
{
  "playwright.cwd": "trello-service-bdd"
}
```

Reload the window (`Ctrl+Shift+P` → "Developer: Reload Window") after adding this so the Test Explorer picks it up.

---

## Logging Architecture (LogTape)

This suite uses LogTape to capture real-time execution logs across multi-worker test runs.

### Log Outputs:

- **Console:** Colorized terminal output using ANSI formatting.
- **File:** Saved to logs/execution.log (automatically created at project root).

| Level     | Method         | Primary Usage                                                          |
| :-------- | :------------- | :--------------------------------------------------------------------- |
| **DEBUG** | `logger.debug` | `trelloClient.ts` — HTTP request/response details & status codes.      |
| **INFO**  | `logger.info`  | Step definitions & hooks — Scenario execution milestones & assertions. |
| **WARN**  | `logger.warn`  | Non-fatal execution warnings or transient delays.                      |
| **ERROR** | `logger.error` | Failed steps, missing scenario context, or HTTP error responses.       |
| **FATAL** | `logger.fatal` | Critical framework setup failures.                                     |

---

## Code Quality & Git Hooks

```bash
# Check code for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format code with Prettier
npm run format
```

## Pre-commit Validation (Husky + lint-staged)

Husky automatically runs lint-staged prior to every Git commit to ensure staged files pass all ESLint and Prettier checks before reaching the repository.

---

## Project Structure

See the project wiki for the full directory layout and workspace breakdown.

---

## Results and contributions

At the last run before the final demo to an external panel, the suite held **61 automated cases: 57 passed, 3 failed and 1 blocked**. The 3 failures are real Trello defects, reported as such.

Built by a team of four. My part (Rosemberth Preciga, [@rprecigapuentes](https://github.com/rprecigapuentes)):

- The Organizations and Labels resources: 31 operations triaged, 19 in scope, and 20 test cases.
- Response contract validation with Zod schemas.
- The GitLab CI pipeline and the self-hosted GitLab Runner it ran on, with resource limits.

The original pipeline is `.gitlab-ci.yml`; `.github/workflows/ci.yml` runs the same quality gates on GitHub and the live suite on demand.
