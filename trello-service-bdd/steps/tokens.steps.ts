import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { request as playwrightRequest } from '@playwright/test';
import { logger } from '@core';

const { Given, When } = createBdd(test);

const MOCK_INVALID_64_CHAR_TOKEN =
  '1111111122222222333333334444444455555555666666667777777788888888';

Given('a dummy API token is configured for testing', async ({ scenarioState }) => {
  scenarioState.mockToken = MOCK_INVALID_64_CHAR_TOKEN;
  logger.info(`Configured 64-character mock token: ${scenarioState.mockToken}`);
});

When('the user sends a request to revoke the token', async ({ scenarioState }) => {
  const token = scenarioState.mockToken as string;
  logger.info(`Sending DELETE /1/tokens/${token}...`);

  const isolatedContext = await playwrightRequest.newContext({
    baseURL: 'https://api.trello.com/',
    extraHTTPHeaders: {},
  });

  const response = await isolatedContext.delete(`1/tokens/${token}`, {
    params: {
      key: process.env.TRELLO_API_KEY!,
      token: token,
    },
  });

  scenarioState.lastResponse = response;
  await isolatedContext.dispose();
});

Given('the token is revoked', async ({ scenarioState }) => {
  scenarioState.isRevoked = true;
  logger.info('Marked scenario token state as revoked.');
});

When('the user requests member details using the revoked token', async ({ scenarioState }) => {
  logger.info('Sending GET /1/members/me with 64-character revoked token...');

  const revokedContext = await playwrightRequest.newContext({
    baseURL: 'https://api.trello.com/',
    extraHTTPHeaders: {},
  });

  const response = await revokedContext.get('1/members/me', {
    params: {
      key: process.env.TRELLO_API_KEY!,
      token: MOCK_INVALID_64_CHAR_TOKEN,
    },
  });

  scenarioState.lastResponse = response;
  await revokedContext.dispose();
});
