import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { logger } from '@core';

const { When, Then } = createBdd(test);

When(
  'I create a list named {string} in the board',
  async ({ listClient, scenarioState }, listName: string) => {
    if (!scenarioState.board?.id) {
      logger.error('Failed to create list: No active board found in scenario state');
      throw new Error('No board found in scenario state');
    }

    logger.info(`Creating list '${listName}' in board ID: '${scenarioState.board.id}'...`);
    const response = await listClient.createList(scenarioState.board.id, listName);
    scenarioState.list = await response.json();
    expect(scenarioState.list?.id).toBeTruthy();
  },
);

When('I fetch the list details', async ({ listClient, scenarioState }) => {
  if (!scenarioState.list?.id) {
    logger.error('Failed to fetch list details: No active list found');
    throw new Error('No active list found');
  }

  logger.info(`Fetching details for list ID: '${scenarioState.list.id}'...`);
  const response = await listClient.getList(scenarioState.list.id);
  scenarioState.list = await response.json();
});

Then('the list name should be {string}', async ({ scenarioState }, expectedName: string) => {
  logger.info(
    `Validating list name. Expected: '${expectedName}', Actual: '${scenarioState.list?.name}'`,
  );
  expect(scenarioState.list?.name).toBe(expectedName);
});

When(
  'I update the list name to {string}',
  async ({ listClient, scenarioState }, newName: string) => {
    if (!scenarioState.list?.id) {
      logger.error('Failed to update list: No active list found');
      throw new Error('No active list found');
    }

    logger.info(`Updating list ID '${scenarioState.list.id}' name to: '${newName}'...`);
    const response = await listClient.updateList(scenarioState.list.id, {
      name: newName,
    });
    scenarioState.list = await response.json();
  },
);

Then('I archive the list', async ({ listClient, scenarioState }) => {
  if (!scenarioState.list?.id) {
    logger.error('Failed to archive list: No active list found');
    throw new Error('No active list found');
  }

  logger.info(`Archiving list ID: '${scenarioState.list.id}'...`);
  const response = await listClient.archiveList(scenarioState.list.id);
  const updated = await response.json();
  expect(updated.closed).toBe(true);
});
