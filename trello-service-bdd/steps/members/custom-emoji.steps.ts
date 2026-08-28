import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/fixtures';
import { expect } from '@playwright/test';
import { customEmojiSchema, customEmojiListSchema } from '../../api/schemas/customAssetSchemas';
import { logger } from '@core';

const { When, Then } = createBdd(test);

When(
  'the user creates a custom emoji with file {string} and name {string}',
  async ({ customEmojiClient, scenarioState }, file: string, name: string) => {
    const uniqueName = `${name}_${Date.now()}`;
    logger.info(`Creating custom emoji with file: ${file} and name: ${uniqueName}`);
    const response = await customEmojiClient.uploadCustomEmoji(file, uniqueName);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.emoji = customEmojiSchema.parse(await response.json());
      expect(scenarioState.emoji.id).toBeTruthy();
    }
  },
);

Then('the response contains a non-empty emoji id', async ({ scenarioState }) => {
  logger.info(`Validating emoji ID: '${scenarioState.emoji?.id}'`);
  expect(scenarioState.emoji?.id).toBeTruthy();
  expect(scenarioState.emoji?.id.length).toBeGreaterThan(0);
});

When('the user retrieves the custom emojis', async ({ customEmojiClient, scenarioState }) => {
  logger.info('Retrieving all custom emojis');
  const response = await customEmojiClient.getCustomEmojis();
  scenarioState.response = response;
});

Then('the response contains an emoji with the created name', async ({ scenarioState }) => {
  logger.info(`Validating emoji '${scenarioState.emoji?.name}' exists in the returned list`);
  expect(scenarioState.emoji?.name).toBeTruthy();
  const emojis = customEmojiListSchema.parse(await scenarioState.response!.json());
  expect(emojis.some((emoji) => emoji.name === scenarioState.emoji?.name)).toBe(true);
});
