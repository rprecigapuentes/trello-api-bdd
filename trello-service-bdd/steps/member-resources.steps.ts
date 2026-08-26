import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { trelloBoardSchema, trelloMemberSchema } from '../api/schemas/trelloSchemas';
import { logger } from '@core/utils/logger';

const { Given, When, Then, After } = createBdd(test);

Then('the response contains a valid array of boards schema', async ({ scenarioState }) => {
  const responseJson = await scenarioState.response!.json();
  expect(Array.isArray(responseJson)).toBe(true);

  for (const board of responseJson) {
    const validationResult = trelloBoardSchema.safeParse(board);
    if (!validationResult.success) {
      logger.error(`Board schema validation failed: ${validationResult.error.message}`);
    }
    expect(validationResult.success).toBe(true);
  }
});

Then(
  'the response contains the board named {string} in the array of boards',
  async ({ scenarioState }, boardName: string) => {
    const boardsArray = await scenarioState.response!.json();
    const matchingBoards = boardsArray.filter((board: { name: string; id: string }) =>
      board.name.includes(boardName),
    );

    expect(matchingBoards.length).toBeGreaterThan(0);
    expect(matchingBoards.map((board: { id: string }) => board.id)).toContain(
      scenarioState.board!.id,
    );
  },
);

Then('the response contains an empty array of boards schema', async ({ scenarioState }) => {
  const boardsArray = await scenarioState.response!.json();
  expect(boardsArray.length).toBe(0);
});
