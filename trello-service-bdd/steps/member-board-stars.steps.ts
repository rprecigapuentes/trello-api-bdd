import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { boardStarSchema } from '../api/schemas/trelloSchemas';
import { logger } from '@core/utils/logger';

const { Given, When, Then } = createBdd(test);

When(
  String.raw`the user sends a POST request to \/members\/\{memberId\}\/boardStars with the board ID and {string} as pos field value`,
  async ({ scenarioState, memberClient }, position: string) => {
    const response = await memberClient.createBoardStar(
      scenarioState.member!.id,
      scenarioState.board!.id,
      position,
    );
    scenarioState.response = response;
  },
);

Then('the response contains a valid board star schema', async ({ scenarioState }) => {
  const responseJson = await scenarioState.response!.json();
  const validationResult = boardStarSchema.safeParse(responseJson);
  if (!validationResult.success) {
    logger.error(`Board star schema validation failed: ${validationResult.error.message}`);
  }
  expect(validationResult.success).toBe(true);
  scenarioState.boardStar = validationResult.data;
});

Then(
  'the response contains the correct board ID and position field value',
  async ({ scenarioState, memberClient }) => {
    const response = await memberClient.getBoardStar(
      scenarioState.member!.id,
      scenarioState.boardStar!.id,
    );
    await expect(response).toBeOK();

    const expectedBoardStar = await response.json();
    expect(scenarioState.boardStar!.idBoard).toBe(expectedBoardStar.idBoard);
    expect(scenarioState.boardStar!.pos).toBe(expectedBoardStar.pos);
  },
);
