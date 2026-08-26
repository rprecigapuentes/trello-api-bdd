import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

// the {string} will be replaced with the actual status code in the feature file e.g. the response status code is "200" or "404"
Then('the response status code is {string}', async ({ scenarioState }, statusCode: string) => {
  expect(scenarioState.response!.status()).toBe(Number(statusCode));
});

// the {string} will be replaced with the actual property name in the feature file e.g. the response contains the "id" property
Then('the response contains the {string} property', async ({ scenarioState }, property: string) => {
  const responseJson = await scenarioState.response!.json();
  expect(responseJson).toHaveProperty(property);
});
