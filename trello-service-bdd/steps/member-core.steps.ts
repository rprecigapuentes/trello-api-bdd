import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { trelloMemberSchema } from '../api/schemas/trelloSchemas';
import { logger } from '@core/utils/logger';

const { Given, When, Then } = createBdd(test);

//This step retrives the ID of the own member and stores it in the scenario state for later use
Given('a member with a valid ID exists', async ({ memberClient, scenarioState }) => {
  const response = await memberClient.getMyMember();
  await expect(response).toBeOK();

  const myMember = trelloMemberSchema.parse(await response.json());
  expect(myMember.id).toBeTruthy();

  scenarioState.member = myMember;
  console.log('This is the ID: ' + scenarioState.member?.id);
});

When(
  String.raw`the user sends a GET request to \/members\/\{memberId\}`,
  async ({ memberClient, scenarioState }) => {
    const response = await memberClient.getMember(scenarioState.member!.id);
    scenarioState.response = response;

    const member = trelloMemberSchema.parse(await response.json());
    scenarioState.member = member;
  },
);

Then('the response status code is 200', async ({ scenarioState }) => {
  expect(scenarioState.response!.status()).toBe(200);
});

Then('the response contains a valid member schema', async ({ scenarioState }) => {
  const validationResult = trelloMemberSchema.safeParse(scenarioState.member);

  if (!validationResult.success) {
    logger.error(`Member schema validation failed: ${validationResult.error.message}`);
  }

  expect(validationResult.success).toBe(true);
});

Then('the response contains the requested member data', async ({ scenarioState, memberClient }) => {
  const response = await memberClient.getMyMember();
  const expectedMember = await response.json();
  expect(expectedMember).toMatchObject(scenarioState.member!); //this ensures to all the properties of the member object are equal to the expected values
});
