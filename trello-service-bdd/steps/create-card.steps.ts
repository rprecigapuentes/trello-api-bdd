import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import {
  TrelloBoardSchema,
  TrelloListSchema,
  TrelloCardSchema,
} from '../api/schemas/trelloSchemas';
import { logger } from '@core';

const { Given, When, Then } = createBdd(test);

let board: TrelloBoardSchema;
let list: TrelloListSchema;
let card: TrelloCardSchema;

const testCardName = 'Automated Card';
const testCardDesc = 'Created via Playwright BDD';

Given('I have created a new board', async ({ boardClient }) => {
  logger.info('Creating prerequisite board for card scenario...');
  const response = await boardClient.createBoard('BDD Test Board');
  board = await response.json();
  expect(board.id).toBeTruthy();
});

Given('I have created a list in the board', async ({ listClient }) => {
  logger.info(`Creating prerequisite list 'To Do' on board ID: '${board.id}'...`);
  const response = await listClient.createList(board.id, 'To Do');
  list = await response.json();
  expect(list.id).toBeTruthy();
});

When('I create a card in the list', async ({ cardClient, scenarioState }) => {
  logger.info(`Creating card '${testCardName}' in list ID: '${list.id}'...`);
  const response = await cardClient.createCard(list.id, testCardName, testCardDesc);
  card = await response.json();
  scenarioState.card = card;
  expect(card.id).toBeTruthy();
});

Then('the card should be created successfully', async () => {
  logger.info(`Validating card creation. Created Card ID: '${card?.id}'`);
  expect(card).toBeDefined();
  expect(card.id).toBeDefined();
});

Then('the card should have the correct name and description', async ({ boardClient }) => {
  logger.info(
    `Validating card properties. Expected name: '${testCardName}', Actual: '${card.name}'`,
  );
  expect(card.name).toBe(testCardName);
  expect(card.desc).toBe(testCardDesc);

  if (board?.id) {
    logger.info(`Tearing down test: Deleting board ID '${board.id}'`);
    await boardClient.deleteBoard(board.id);
  }
});
