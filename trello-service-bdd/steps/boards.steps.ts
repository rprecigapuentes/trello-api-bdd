import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { expect } from '@playwright/test';
import { logger } from '@core';

const { Given, When, Then } = createBdd(test);

Given('I create a new board named {string}', async ({ trelloApi, scenarioState }, name: string) => {
  logger.info(`Creating Trello board with title: ${name}`);
  scenarioState.board = await trelloApi.createBoard(name);
  logger.debug(`POST /1/boards - Board ID created: ${scenarioState.board.id}`);
  expect(scenarioState.board.id).toBeTruthy();
});

When('I fetch the board details', async ({ trelloApi, scenarioState }) => {
  if (!scenarioState.board?.id) throw new Error('No active board found');

  logger.info(`Fetching details for board ID: ${scenarioState.board.id}`);
  scenarioState.board = await trelloApi.getBoard(scenarioState.board.id);
  logger.debug(`GET /1/boards/${scenarioState.board.id} - Status 200 OK`);
});

Then('the board name should be {string}', async ({ scenarioState }, expectedName: string) => {
  logger.info(
    `Validating board name. Expected: "${expectedName}", Actual: "${scenarioState.board?.name}"`,
  );
  expect(scenarioState.board?.name).toBe(expectedName);
});

When(
  'I update the board name to {string}',
  async ({ trelloApi, scenarioState }, newName: string) => {
    if (!scenarioState.board?.id) throw new Error('No active board found');

    logger.info(`Updating board ID ${scenarioState.board.id} name to: ${newName}`);
    scenarioState.board = await trelloApi.updateBoard(scenarioState.board.id, {
      name: newName,
    });
    logger.debug(`PUT /1/boards/${scenarioState.board.id} - Success`);
  },
);

Then('I clean up by deleting the board', async ({ trelloApi, scenarioState }) => {
  if (scenarioState.board?.id) {
    logger.info(`Tearing down test: Deleting board ID ${scenarioState.board.id}`);
    await trelloApi.deleteBoard(scenarioState.board.id);
    logger.debug(`DELETE /1/boards/${scenarioState.board.id} - Success`);
    scenarioState.board = undefined;
  }
});
