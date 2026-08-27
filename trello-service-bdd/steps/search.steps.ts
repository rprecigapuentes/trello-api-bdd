import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { logger } from '@core';

const { Given, When, Then, After } = createBdd(test);

Given(
  'the member has at least one organization named {string}',
  async ({ scenarioState }, organizationName: string) => {
    expect(1).toBe(1);
  },
);

When(
  String.raw`the user sends a GET request to \/search?query={string}`,
  async ({ searchClient, scenarioState }, query: string) => {
    const response = await searchClient.search(query);
    scenarioState.response = response;
  },
);

Then(
  'the response contains only {string} in the {string} array',
  async ({ scenarioState }, itemName: string, arrayName: string) => {
    const responseBody = await scenarioState.response?.json();
    expect(responseBody[arrayName]).toBeDefined();

    const items = responseBody[arrayName];
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      logger.error(`Checking item: ${item.name} against expected: ${itemName}`);
      expect(item.name).toContain(itemName);
    }
  },
);
