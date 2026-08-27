import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { trelloMemberSchema } from '../api/schemas/trelloSchemas';
import { logger } from '@core/utils/logger';

const { Given, When, Then, After } = createBdd(test);

//This step retrives the ID of the own member and stores it in the scenario state for later use
Given('a member with a valid ID exists', async ({ memberClient, scenarioState }) => {
  const response = await memberClient.getMyMember();
  await expect(response).toBeOK();

  const myMember = trelloMemberSchema.parse(await response.json());
  expect(myMember.id).toBeTruthy();

  scenarioState.member = myMember;
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

Given('{string} is a valid field of the member model', async ({}, field: string) => {
  const memberFields = Object.keys(trelloMemberSchema.shape);
  expect(memberFields).toContain(field);
});

Given('{string} is an invalid field of the member model', async ({}, nonExistentField: string) => {
  const memberFields = Object.keys(trelloMemberSchema.shape);
  expect(memberFields).not.toContain(nonExistentField);
});

//common step for fetching a specific field of the member model
When(
  String.raw`the user sends a GET request to \/members\/\{memberId\}\/{word}`,
  async ({ memberClient, scenarioState }, field: string) => {
    const response = await memberClient.getMemberField(scenarioState.member!.id, field);
    scenarioState.response = response;
  },
);

Then(
  'the response contains the correct {string} value under {string} property',
  async ({ scenarioState }, field: string, property: string) => {
    const responseJson = await scenarioState.response!.json();
    const key = field as keyof NonNullable<typeof scenarioState.member>;
    expect(responseJson[property]).toEqual(scenarioState.member![key]);
  },
);

Then(
  'the response contains an error message indicating the {string} field does not exist',
  async ({ scenarioState }, nonExistentField: string) => {
    const responseJson = await scenarioState.response!.text();
    expect(responseJson).toMatch(
      `Cannot GET /1/members/${scenarioState.member!.id}/${nonExistentField}`,
    );
  },
);
