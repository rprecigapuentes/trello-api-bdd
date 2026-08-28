import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/fixtures';
import { expect } from '@playwright/test';
import {
  backgroundListSchema,
  trelloBoardBackgroundSchema,
} from '../../api/schemas/backgroundSchemas';
import { logger } from '@core';

const { Given, When, Then } = createBdd(test);

Given(
  'an existing standard board background with file {string}',
  async ({ backgroundClient, scenarioState }, file: string) => {
    logger.info(`Creating prerequisite background with file: ${file}`);
    const response = await backgroundClient.uploadBackground(file);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
    }
  },
);

When(
  'the user uploads a standard board background with file {string}',
  async ({ backgroundClient, scenarioState }, file: string) => {
    logger.info(`Uploading standard board background with file: ${file}`);
    const response = await backgroundClient.uploadBackground(file);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
      expect(scenarioState.background.id).toBeTruthy();
    }
  },
);

Then('the response contains a background object with a non-empty id', async ({ scenarioState }) => {
  logger.info(`Validating background ID: '${scenarioState.background?.id}'`);
  expect(scenarioState.background?.id).toBeTruthy();
  expect(scenarioState.background?.id.length).toBeGreaterThan(0);
});

When('the user retrieves the board backgrounds', async ({ backgroundClient, scenarioState }) => {
  logger.info('Retrieving all board backgrounds');
  const response = await backgroundClient.getBackgrounds();
  scenarioState.response = response;
});

Then('the response includes the newly created background ID', async ({ scenarioState }) => {
  logger.info(
    `Validating background ID '${scenarioState.background?.id}' exists in the returned list`,
  );
  expect(scenarioState.background?.id).toBeTruthy();
  const backgrounds = backgroundListSchema.parse(await scenarioState.response!.json());
  expect(backgrounds.some((background) => background.id === scenarioState.background?.id)).toBe(
    true,
  );
});

When(
  'the user updates the board background with parameter {string} set to {string}',
  async ({ backgroundClient, scenarioState }, param: string, value: string) => {
    const id = scenarioState.background?.id;
    if (!id) throw new Error('No background ID saved');
    logger.info(`Updating background ${id}: ${param} = ${value}`);
    const response = await backgroundClient.updateBackground(id, { [param]: value });
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
    }
  },
);

When('the user retrieves the background', async ({ backgroundClient, scenarioState }) => {
  const id = scenarioState.background?.id;
  if (!id) throw new Error('No background ID saved');
  logger.info(`Retrieving background: ${id}`);
  const response = await backgroundClient.getBackground(id);
  scenarioState.response = response;
  if (response.ok()) {
    scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
  }
});

Then(
  'the response contains {string} equal to {string}',
  async ({ scenarioState }, param: string, value: string) => {
    const responseJson = trelloBoardBackgroundSchema.parse(
      await scenarioState.response!.json(),
    ) as unknown as Record<string, unknown>;
    logger.info(`Validating ${param}: expected "${value}", actual "${responseJson[param]}"`);
    expect(responseJson[param]).toBe(value);
  },
);

When('the user deletes the board background', async ({ backgroundClient, scenarioState }) => {
  const id = scenarioState.background?.id;
  if (!id) throw new Error('No background ID saved');
  logger.info(`Deleting background: ${id}`);
  const response = await backgroundClient.deleteBackground(id);
  scenarioState.response = response;
});

When(
  'the user attempts to retrieve the deleted background',
  async ({ backgroundClient, scenarioState }) => {
    const id = scenarioState.background?.id;
    if (!id) throw new Error('No background ID saved');
    logger.info(`Attempting to retrieve deleted background: ${id}`);
    const response = await backgroundClient.getBackground(id);
    scenarioState.response = response;
  },
);
