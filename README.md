# Playwright BDD

API test automation project using Playwright, TypeScript, and `playwright-bdd`, organized as an **npm workspaces monorepo**. The active suite lives in the `trello-service-bdd` workspace.

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

## Project Structure

See the project wiki for the full directory layout and workspace breakdown.

