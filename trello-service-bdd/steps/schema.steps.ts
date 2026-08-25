import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import { trelloCardSchema } from '../api/schemas/trelloSchemas';

const { Then } = createBdd(test);

Then('the response is matching the expected schema', async ({ scenarioState }) => {
  const result = trelloCardSchema.safeParse(scenarioState.card);
  expect(
    result.success,
    `Response does not match the card schema:\n${JSON.stringify(result.error?.issues, null, 2)}`,
  ).toBe(true);
});
