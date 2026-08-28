import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/fixtures';
import { expect } from '@playwright/test';
import { customStickerSchema, customStickerListSchema } from '../../api/schemas/customAssetSchemas';
import { logger } from '@core';

const { Given, When, Then } = createBdd(test);

Given(
  'an existing custom sticker with file {string}',
  async ({ customStickerClient, scenarioState }, file: string) => {
    logger.info(`Creating prerequisite custom sticker with file: ${file}`);
    const response = await customStickerClient.uploadCustomSticker(file);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.sticker = customStickerSchema.parse(await response.json());
    }
  },
);

When(
  'the user uploads a custom sticker with file {string}',
  async ({ customStickerClient, scenarioState }, file: string) => {
    logger.info(`Uploading custom sticker with file: ${file}`);
    const response = await customStickerClient.uploadCustomSticker(file);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.sticker = customStickerSchema.parse(await response.json());
      expect(scenarioState.sticker.id).toBeTruthy();
    }
  },
);

Then('the response contains a non-empty sticker id', async ({ scenarioState }) => {
  logger.info(`Validating sticker ID: '${scenarioState.sticker?.id}'`);
  expect(scenarioState.sticker?.id).toBeTruthy();
  expect(scenarioState.sticker?.id.length).toBeGreaterThan(0);
});

When('the user retrieves the custom stickers', async ({ customStickerClient, scenarioState }) => {
  logger.info('Retrieving all custom stickers');
  const response = await customStickerClient.getCustomStickers();
  scenarioState.response = response;
});

Then('the response includes the new sticker ID', async ({ scenarioState }) => {
  logger.info(`Validating sticker ID '${scenarioState.sticker?.id}' exists in the returned list`);
  expect(scenarioState.sticker?.id).toBeTruthy();
  const stickers = customStickerListSchema.parse(await scenarioState.response!.json());
  expect(stickers.some((sticker) => sticker.id === scenarioState.sticker?.id)).toBe(true);
});

When('the user deletes the custom sticker', async ({ customStickerClient, scenarioState }) => {
  const id = scenarioState.sticker?.id;
  if (!id) throw new Error('No custom sticker ID saved');
  logger.info(`Deleting custom sticker: ${id}`);
  const response = await customStickerClient.deleteCustomSticker(id);
  scenarioState.response = response;
});

When(
  'the user attempts to retrieve the deleted sticker',
  async ({ customStickerClient, scenarioState }) => {
    const id = scenarioState.sticker?.id;
    if (!id) throw new Error('No custom sticker ID saved');
    logger.info(`Attempting to retrieve deleted custom sticker: ${id}`);
    const response = await customStickerClient.getCustomSticker(id);
    scenarioState.response = response;
  },
);
