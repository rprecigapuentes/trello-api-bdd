import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';

const { Given, Then } = createBdd(test);

Given('an authenticated Trello API client', async ({}) => {
  expect(
    process.env.TRELLO_API_KEY,
    'TRELLO_API_KEY is not set in environment variables',
  ).toBeTruthy();
  expect(
    process.env.TRELLO_API_TOKEN,
    'TRELLO_API_TOKEN is not set in environment variables',
  ).toBeTruthy();
});

Then('the response body contains {string}', async ({ scenarioState }, text: string) => {
  const body = await scenarioState.response!.text();
  expect(body).toContain(text);
});

Then(
  'the response body reports that the {string} was not found',
  async ({ scenarioState }, resource: string) => {
    const body = await scenarioState.response!.text();
    expect(body).toContain(`${resource} not found`);
  },
);

Then(
  'the response body reports that the requested resource was not found',
  async ({ scenarioState }) => {
    const body = await scenarioState.response!.text();
    expect(body).toContain('The requested resource was not found.');
  },
);
