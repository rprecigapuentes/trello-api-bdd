import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { expect } from '@playwright/test';
import { logger } from '@core';

const { When, Then } = createBdd(test);

When(
  'I create a list named {string} in the board',
  async ({ trelloApi, scenarioState }, listName: string) => {
    if (!scenarioState.board?.id) {
      logger.error('Failed to create list: No active board found in scenario state');
      throw new Error('No board found in scenario state');
    }

    logger.info(`Creating list '${listName}' in board ID: '${scenarioState.board.id}'...`);
    scenarioState.list = await trelloApi.createList(scenarioState.board.id, listName);
    expect(scenarioState.list.id).toBeTruthy();
  },
);

When('I fetch the list details', async ({ trelloApi, scenarioState }) => {
  if (!scenarioState.list?.id) {
    logger.error('Failed to fetch list details: No active list found');
    throw new Error('No active list found');
  }

  logger.info(`Fetching details for list ID: '${scenarioState.list.id}'...`);
  scenarioState.list = await trelloApi.getList(scenarioState.list.id);
});

Then('the list name should be {string}', async ({ scenarioState }, expectedName: string) => {
  logger.info(
    `Validating list name. Expected: '${expectedName}', Actual: '${scenarioState.list?.name}'`,
  );
  expect(scenarioState.list?.name).toBe(expectedName);
});

When(
  'I update the list name to {string}',
  async ({ trelloApi, scenarioState }, newName: string) => {
    if (!scenarioState.list?.id) {
      logger.error('Failed to update list: No active list found');
      throw new Error('No active list found');
    }

    logger.info(`Updating list ID '${scenarioState.list.id}' name to: '${newName}'...`);
    scenarioState.list = await trelloApi.updateList(scenarioState.list.id, {
      name: newName,
    });
  },
);

Then('I archive the list', async ({ trelloApi, scenarioState }) => {
  if (!scenarioState.list?.id) {
    logger.error('Failed to archive list: No active list found');
    throw new Error('No active list found');
  }

  logger.info(`Archiving list ID: '${scenarioState.list.id}'...`);
  const updated = await trelloApi.archiveList(scenarioState.list.id);
  expect(updated.closed).toBe(true);
});
