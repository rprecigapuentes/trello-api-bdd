import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { logger } from '@core';

const { Given, When, Then } = createBdd(test);

Given(
  'I create a new board named {string}',
  async ({ boardClient, scenarioState }, name: string) => {
    logger.info(`Creating Trello board with title: ${name}`);
    const response = await boardClient.createBoard(name);
    scenarioState.board = await response.json();
    logger.debug(`POST /1/boards - Board ID created: ${scenarioState.board?.id}`);
    expect(scenarioState.board?.id).toBeTruthy();
  },
);

When('I fetch the board details', async ({ boardClient, scenarioState }) => {
  if (!scenarioState.board?.id) throw new Error('No active board found');
  logger.info(`Fetching details for board ID: ${scenarioState.board.id}`);
  const response = await boardClient.getBoard(scenarioState.board.id);
  scenarioState.board = await response.json();
  logger.debug(`GET /1/boards/${scenarioState.board?.id} - Status 200 OK`);
});

Then('the board name should be {string}', async ({ scenarioState }, expectedName: string) => {
  logger.info(
    `Validating board name. Expected: "${expectedName}", Actual: "${scenarioState.board?.name}"`,
  );
  expect(scenarioState.board?.name).toBe(expectedName);
});

When(
  'I update the board name to {string}',
  async ({ boardClient, scenarioState }, newName: string) => {
    if (!scenarioState.board?.id) throw new Error('No active board found');

    logger.info(`Updating board ID ${scenarioState.board.id} name to: ${newName}`);
    const response = await boardClient.updateBoard(scenarioState.board.id, {
      name: newName,
    });
    scenarioState.board = await response.json();
    logger.debug(`PUT /1/boards/${scenarioState.board?.id} - Success`);
  },
);

Then('I clean up by deleting the board', async ({ boardClient, scenarioState }) => {
  if (scenarioState.board?.id) {
    logger.info(`Tearing down test: Deleting board ID ${scenarioState.board.id}`);
    await boardClient.deleteBoard(scenarioState.board.id);
    logger.debug(`DELETE /1/boards/${scenarioState.board.id} - Success`);
    scenarioState.board = undefined;
  }
});
