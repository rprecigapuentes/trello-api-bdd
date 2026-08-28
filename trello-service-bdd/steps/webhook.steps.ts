import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { trelloBoardSchema } from '../api/schemas/trelloSchemas';
import { webhookSchema, trelloWebhookPayloadSchema } from '../api/schemas/webhookSchemas';
import { logger } from '@core';

const { Given, When, Then } = createBdd(test);

const DEFAULT_CALLBACK_URL = 'https://example.com/';

Given('a board to monitor', async ({ boardClient, scenarioState }) => {
  logger.info('Creating board to use as webhook idModel');
  const response = await boardClient.createBoard('Webhook Test Board');
  scenarioState.board = trelloBoardSchema.parse(await response.json());
  expect(scenarioState.board.id).toBeTruthy();
});

Given('an existing webhook', async ({ boardClient, webhookClient, scenarioState }) => {
  logger.info('Creating board to use as webhook idModel');
  const boardResponse = await boardClient.createBoard('Webhook Test Board');
  scenarioState.board = trelloBoardSchema.parse(await boardResponse.json());

  logger.info(`Creating webhook on board: ${scenarioState.board.id}`);
  const response = await webhookClient.createWebhook(DEFAULT_CALLBACK_URL, scenarioState.board.id);
  scenarioState.response = response;
  if (response.ok()) {
    scenarioState.webhook = webhookSchema.parse(await response.json());
  }
});

When(
  'the user creates a webhook with callback URL {string}',
  async ({ webhookClient, scenarioState }, callbackURL: string) => {
    const idModel = scenarioState.board?.id;
    if (!idModel) throw new Error('No board ID saved');
    logger.info(`Creating webhook with callback URL: ${callbackURL} on model: ${idModel}`);
    const response = await webhookClient.createWebhook(callbackURL, idModel);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.webhook = webhookSchema.parse(await response.json());
      expect(scenarioState.webhook.id).toBeTruthy();
    }
  },
);

Then(
  'the response contains a webhook object with active set to true',
  async ({ scenarioState }) => {
    logger.info(`Validating webhook ID: '${scenarioState.webhook?.id}'`);
    expect(scenarioState.webhook?.id).toBeTruthy();
    expect(scenarioState.webhook?.active).toBe(true);
  },
);

When('the user retrieves the webhook', async ({ webhookClient, scenarioState }) => {
  const id = scenarioState.webhook?.id;
  if (!id) throw new Error('No webhook ID saved');
  logger.info(`Retrieving webhook: ${id}`);
  const response = await webhookClient.getWebhook(id);
  scenarioState.response = response;
  if (response.ok()) {
    scenarioState.webhook = webhookSchema.parse(await response.json());
  }
});

Then(
  'the response contains the callback URL {string} and active status {word}',
  async ({ scenarioState }, callbackURL: string, active: string) => {
    const expectedActive = active === 'true';
    logger.info(
      `Validating callback URL: expected "${callbackURL}", actual "${scenarioState.webhook?.callbackURL}"`,
    );
    expect(scenarioState.webhook?.callbackURL).toBe(callbackURL);
    expect(scenarioState.webhook?.active).toBe(expectedActive);
  },
);

When(
  'the user updates the webhook with description {string} and active set to {string}',
  async ({ webhookClient, scenarioState }, description: string, active: string) => {
    const id = scenarioState.webhook?.id;
    if (!id) throw new Error('No webhook ID saved');
    logger.info(`Updating webhook ${id}: description = ${description}, active = ${active}`);
    const response = await webhookClient.updateWebhook(id, { description, active });
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.webhook = webhookSchema.parse(await response.json());
    }
  },
);

Then(
  'the response contains description {string} and active status {word}',
  async ({ scenarioState }, description: string, active: string) => {
    const expectedActive = active === 'true';
    logger.info(
      `Validating description: expected "${description}", actual "${scenarioState.webhook?.description}"`,
    );
    expect(scenarioState.webhook?.description).toBe(description);
    expect(scenarioState.webhook?.active).toBe(expectedActive);
  },
);

When('the user deletes the webhook', async ({ webhookClient, scenarioState }) => {
  const id = scenarioState.webhook?.id;
  if (!id) throw new Error('No webhook ID saved');
  logger.info(`Deleting webhook: ${id}`);
  const response = await webhookClient.deleteWebhook(id);
  scenarioState.response = response;
});

When(
  'the user attempts to retrieve the deleted webhook',
  async ({ webhookClient, scenarioState }) => {
    const id = scenarioState.webhook?.id;
    if (!id) throw new Error('No webhook ID saved');
    logger.info(`Attempting to retrieve deleted webhook: ${id}`);
    const response = await webhookClient.getWebhook(id);
    scenarioState.response = response;
  },
);

When(
  'the user creates a webhook with a test callback URL',
  async ({ webhookClient, webhookSiteClient, scenarioState }) => {
    const idModel = scenarioState.board?.id;
    if (!idModel) throw new Error('No board ID saved');

    const token = await webhookSiteClient.createToken();
    scenarioState.webhookToken = token.uuid;
    const callbackURL = `https://webhook.site/${token.uuid}`;

    logger.info(`Creating webhook with callback URL: ${callbackURL} on model: ${idModel}`);
    const response = await webhookClient.createWebhook(callbackURL, idModel);
    scenarioState.response = response;
    if (response.ok()) {
      scenarioState.webhook = webhookSchema.parse(await response.json());
      expect(scenarioState.webhook.id).toBeTruthy();
    }
  },
);

Then('the response contains the correct callback URL and idModel', async ({ scenarioState }) => {
  const expectedCallbackURL = `https://webhook.site/${scenarioState.webhookToken}`;
  logger.info(
    `Validating callback URL: expected "${expectedCallbackURL}", actual "${scenarioState.webhook?.callbackURL}"`,
  );
  expect(scenarioState.webhook?.callbackURL).toBe(expectedCallbackURL);
  expect(scenarioState.webhook?.idModel).toBe(scenarioState.board?.id);
});

When('an action is triggered on the monitored board', async ({ boardClient, scenarioState }) => {
  const boardId = scenarioState.board?.id;
  if (!boardId) throw new Error('No board ID saved');

  logger.info(`Triggering updateBoard event by renaming board: ${boardId}`);
  const response = await boardClient.updateBoard(boardId, { name: 'Renamed Webhook Board' });
  expect(response.ok()).toBe(true);
});

Then(
  'the callback URL receives a valid JSON payload for the event',
  async ({ webhookSiteClient, scenarioState }) => {
    const tokenId = scenarioState.webhookToken;
    if (!tokenId) throw new Error('No webhook.site token saved');

    logger.info(`Polling webhook.site for the event payload on token ${tokenId}`);
    const deadline = Date.now() + 30000;
    let rawPayload: unknown;
    while (Date.now() < deadline) {
      const requests = await webhookSiteClient.getRequests(tokenId);
      for (const request of requests) {
        if (!request.content) continue;
        try {
          const parsed = JSON.parse(request.content);
          if (parsed?.action?.type === 'updateBoard') {
            rawPayload = parsed;
            break;
          }
        } catch {
          // ignore non-JSON content (e.g. HEAD validation requests)
        }
      }
      if (rawPayload) break;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (!rawPayload) {
      throw new Error('Timed out waiting for the updateBoard webhook payload');
    }

    const payload = trelloWebhookPayloadSchema.parse(rawPayload);
    expect(payload.action.type).toBe('updateBoard');
    expect(payload.model.id).toBe(scenarioState.board?.id);
  },
);
