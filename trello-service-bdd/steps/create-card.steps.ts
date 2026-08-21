import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { expect } from '@playwright/test';
import { TrelloBoard, TrelloList, TrelloCard } from './api/trelloSchemas';
import { logger } from '@core';

const { Given, When, Then } = createBdd(test);

let board: TrelloBoard;
let list: TrelloList;
let card: TrelloCard;

const testCardName = 'Automated Card';
const testCardDesc = 'Created via Playwright BDD';

Given('I have created a new board', async ({ trelloApi }) => {
  logger.info('Creating prerequisite board for card scenario...');
  board = await trelloApi.createBoard('BDD Test Board');
  expect(board.id).toBeTruthy();
});

Given('I have created a list in the board', async ({ trelloApi }) => {
  logger.info(`Creating prerequisite list 'To Do' on board ID: '${board.id}'...`);
  list = await trelloApi.createList(board.id, 'To Do');
  expect(list.id).toBeTruthy();
});

When('I create a card in the list', async ({ trelloApi, scenarioState }) => {
  logger.info(`Creating card '${testCardName}' in list ID: '${list.id}'...`);
  card = await trelloApi.createCard(list.id, testCardName, testCardDesc);
  scenarioState.card = card;
  expect(card.id).toBeTruthy();
});

Then('the card should be created successfully', async () => {
  logger.info(`Validating card creation. Created Card ID: '${card?.id}'`);
  expect(card).toBeDefined();
  expect(card.id).toBeDefined();
});

Then('the card should have the correct name and description', async ({ trelloApi }) => {
  logger.info(
    `Validating card properties. Expected name: '${testCardName}', Actual: '${card.name}'`,
  );
  expect(card.name).toBe(testCardName);
  expect(card.desc).toBe(testCardDesc);

  if (board?.id) {
    logger.info(`Tearing down test: Deleting board ID '${board.id}'`);
    await trelloApi.deleteBoard(board.id);
  }
});
