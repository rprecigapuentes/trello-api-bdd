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
  'an existing custom board background with file {string}',
  async ({ customBackgroundClient, scenarioState }, file: string) => {
    logger.info(`Creating prerequisite custom background with file: ${file}`);
    const response = await customBackgroundClient.uploadCustomBackground(file);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
    }
  },
);

When(
  'the user uploads a custom board background with file {string}',
  async ({ customBackgroundClient, scenarioState }, file: string) => {
    logger.info(`Uploading custom board background with file: ${file}`);
    const response = await customBackgroundClient.uploadCustomBackground(file);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
      expect(scenarioState.background.id).toBeTruthy();
    }
  },
);

Then(
  'the response contains a custom background object with a non-empty id',
  async ({ scenarioState }) => {
    logger.info(`Validating custom background ID: '${scenarioState.background?.id}'`);
    expect(scenarioState.background?.id).toBeTruthy();
    expect(scenarioState.background?.id.length).toBeGreaterThan(0);
  },
);

When(
  'the user retrieves the custom board backgrounds',
  async ({ customBackgroundClient, scenarioState }) => {
    logger.info('Retrieving all custom board backgrounds');
    const response = await customBackgroundClient.getCustomBackgrounds();
    scenarioState.response = response;
  },
);

Then('the response includes the newly created custom background ID', async ({ scenarioState }) => {
  logger.info(
    `Validating custom background ID '${scenarioState.background?.id}' exists in the returned list`,
  );
  expect(scenarioState.background?.id).toBeTruthy();
  const backgrounds = backgroundListSchema.parse(await scenarioState.response!.json());
  expect(backgrounds.some((background) => background.id === scenarioState.background?.id)).toBe(
    true,
  );
});

When(
  'the user updates the custom board background with parameter {string} set to {string}',
  async ({ customBackgroundClient, scenarioState }, param: string, value: string) => {
    const id = scenarioState.background?.id;
    if (!id) throw new Error('No custom background ID saved');
    logger.info(`Updating custom background ${id}: ${param} = ${value}`);
    const response = await customBackgroundClient.updateCustomBackground(id, { [param]: value });
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
    }
  },
);

When(
  'the user retrieves the custom background',
  async ({ customBackgroundClient, scenarioState }) => {
    const id = scenarioState.background?.id;
    if (!id) throw new Error('No custom background ID saved');
    logger.info(`Retrieving custom background: ${id}`);
    const response = await customBackgroundClient.getCustomBackground(id);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.background = trelloBoardBackgroundSchema.parse(await response.json());
    }
  },
);

Then(
  'the custom background contains {string} equal to {word}',
  async ({ scenarioState }, param: string, value: string) => {
    const expected = value === 'true';
    const responseJson = trelloBoardBackgroundSchema.parse(
      await scenarioState.response!.json(),
    ) as unknown as Record<string, unknown>;
    logger.info(`Validating ${param}: expected "${expected}", actual "${responseJson[param]}"`);
    expect(responseJson[param]).toBe(expected);
  },
);

When(
  'the user deletes the custom board background',
  async ({ customBackgroundClient, scenarioState }) => {
    const id = scenarioState.background?.id;
    if (!id) throw new Error('No custom background ID saved');
    logger.info(`Deleting custom background: ${id}`);
    const response = await customBackgroundClient.deleteCustomBackground(id);
    scenarioState.response = response;
  },
);

When(
  'the user attempts to retrieve the deleted custom background',
  async ({ customBackgroundClient, scenarioState }) => {
    const id = scenarioState.background?.id;
    if (!id) throw new Error('No custom background ID saved');
    logger.info(`Attempting to retrieve deleted custom background: ${id}`);
    const response = await customBackgroundClient.getCustomBackground(id);
    scenarioState.response = response;
  },
);
