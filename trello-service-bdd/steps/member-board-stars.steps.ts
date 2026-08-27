import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { boardStarSchema } from '../api/schemas/trelloSchemas';
import { logger } from '@core/utils/logger';
import { testDataName } from '@core/utils/test-data-name-generator';

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
  'the response contains the correct board ID and {string} field value',
  async ({ scenarioState }, position: string) => {
    expect(scenarioState.boardStar!.idBoard).toBe(scenarioState.board!.id);
    const posValue = Number(position);
    if (!Number.isNaN(posValue)) {
      expect(scenarioState.boardStar!.pos).toBe(posValue);
    }
  },
);

Given(
  'the member has a board star with the {string} position in a board named {string}',
  async ({ scenarioState, boardClient, memberClient }, position: string, dataName: string) => {
    const boardName = testDataName(dataName, 'Board');

    const response = await boardClient.createBoard(boardName);
    const board = await response.json();
    scenarioState.board = board;

    const starResponse = await memberClient.createBoardStar(
      scenarioState.member!.id,
      scenarioState.board!.id,
      position,
    );
    expect(starResponse.ok()).toBe(true);
    const boardStar = await starResponse.json();
    expect(boardStar).toBeTruthy();
    scenarioState.boardStar = boardStar;
  },
);

When(
  String.raw`the user sends a GET request to \/members\/\{memberId\}\/boardStars\/\{boardStarId\}`,
  async ({ scenarioState, memberClient }) => {
    const response = await memberClient.getBoardStar(
      scenarioState.member!.id,
      scenarioState.boardStar!.id,
    );
    scenarioState.response = response;
  },
);

Then(
  /^the GET response contains the "(?:created|updated)" board star with the correct values$/,
  async ({ scenarioState, memberClient }) => {
    const response = await memberClient.getBoardStar(
      scenarioState.member!.id,
      scenarioState.boardStar!.id,
    );
    const responseJson = await response.json();
    const expectedBoardStar = boardStarSchema.parse(responseJson);
    expect(expectedBoardStar).toEqual(scenarioState.boardStar);
  },
);

When(
  String.raw`the user sends a PUT request to \/members\/\{memberId\}\/boardStars\/\{boardStarId\} with the board ID and {string} as pos field value`,
  async ({ scenarioState, memberClient }, position: string) => {
    const response = await memberClient.updateBoardStar(
      scenarioState.member!.id,
      scenarioState.boardStar!.id,
      position,
    );
    scenarioState.response = response;
  },
);

When(
  String.raw`the user sends a DELETE request to \/members\/\{memberId\}\/boardStars\/\{boardStarId\}`,
  async ({ scenarioState, memberClient }) => {
    const response = await memberClient.deleteBoardStar(
      scenarioState.member!.id,
      scenarioState.boardStar!.id,
    );
    scenarioState.response = response;
  },
);

Then(
  'the GET board star by id response returns a {string} status code',
  async ({ scenarioState, memberClient }, statusCode: string) => {
    const response = await memberClient.getBoardStar(
      scenarioState.member!.id,
      scenarioState.boardStar!.id,
    );
    expect(response.status()).toBe(Number(statusCode));
  },
);
