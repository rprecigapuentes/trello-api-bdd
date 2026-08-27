import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { trelloBoardSchema, trelloCardSchema } from '../api/schemas/trelloSchemas';
import { logger } from '@core/utils/logger';

const { Given, Then } = createBdd(test);

type NamedResource = {
  name: string;
};

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

Then('the response contains a valid array of cards schema', async ({ scenarioState }) => {
  const responseJson = await scenarioState.response!.json();
  expect(Array.isArray(responseJson)).toBe(true);

  for (const card of responseJson) {
    const validationResult = trelloCardSchema.safeParse(card);
    if (!validationResult.success) {
      logger.error(`Card schema validation failed: ${validationResult.error.message}`);
    }
    expect(validationResult.success).toBe(true);
  }
});

Then(
  'the response contains the card named {string} in the array of cards',
  async ({ scenarioState }, cardName: string) => {
    const cardsArray = await scenarioState.response!.json();
    const matchingCards = cardsArray.filter((card: { name: string; id: string }) =>
      card.name.includes(cardName),
    );

    expect(matchingCards.length).toBeGreaterThan(0);
    expect(matchingCards.map((card: { id: string }) => card.id)).toContain(scenarioState.card!.id);
  },
);

Given(
  'the member does not have any {string} named {string}',
  async ({ scenarioState, memberClient }, resourceType: string, dataName: string) => {
    const response = await memberClient.getMemberField(scenarioState.member!.id, resourceType);
    const itemsArray: NamedResource[] = await response.json();
    expect(itemsArray).toBeDefined();

    const filteredItems = itemsArray.filter((item) => item.name.includes(dataName));
    expect(filteredItems.length).toBe(0);
  },
);

Then(
  'the response contains an empty {string} array',
  async ({ scenarioState }, resourceType: string) => {
    const itemsArray = await scenarioState.response!.json();

    expect(Array.isArray(itemsArray[resourceType])).toBe(true);
    expect(itemsArray[resourceType].length).toBe(0);
  },
);
