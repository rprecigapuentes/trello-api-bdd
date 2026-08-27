import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { testDataName, testDataSlug } from '@core';
import { expect } from '@playwright/test';
import { logger } from '../../core/utils/logger';

const { When, Then } = createBdd(test);

const zephyrKey = (tags: string[]): string => {
  const tag = tags.find((t) => /^@SCRUM-T\d+$/.test(t));
  if (!tag) throw new Error('Scenario is missing its @SCRUM-T<n> tag, needed for the tcID');
  return tag.slice(1);
};

When(
  'the user creates an organization with a generated displayName',
  async ({ organizationClient, scenarioState, $testInfo }) => {
    const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
    scenarioState.generated.displayName = displayName;
    scenarioState.response = await organizationClient.create({ displayName });
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
      scenarioState.createdOrganizationIds.push(scenarioState.organization!.id);
    }
    logger.info(
      `Created organization with ID: ${scenarioState.organization!.id} and displayName: ${scenarioState.generated.displayName} after scenario: ${$testInfo.title}`,
    );
  },
);

When(
  'the user creates an organization with a generated displayName, a generated name, desc {string}, and website {string}',
  async ({ organizationClient, scenarioState, $testInfo }, desc: string, website: string) => {
    const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
    const name = testDataSlug(zephyrKey($testInfo.tags), 'Organization');
    scenarioState.generated.displayName = displayName;
    scenarioState.generated.name = name;
    scenarioState.generated.desc = desc;
    scenarioState.generated.website = website;
    scenarioState.response = await organizationClient.create({ displayName, name, desc, website });
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
      scenarioState.createdOrganizationIds.push(scenarioState.organization!.id);
    }
    logger.info(
      `Created organization with ID: ${scenarioState.organization!.id}, displayName: ${scenarioState.generated.displayName}, name: ${scenarioState.generated.name}, website: ${scenarioState.generated.website} and description: ${scenarioState.generated.desc} after scenario: ${$testInfo.title}`,
    );
  },
);

Then('the response contains a non-empty organization id', async ({ scenarioState }) => {
  const body = await scenarioState.response!.json();
  expect(body.id).toBeTruthy();
});

Then(
  'the response contains the organization with the submitted {string}',
  async ({ scenarioState }, field: string) => {
    const expectedField = scenarioState.generated[field];
    const body = await scenarioState.response!.json();
    expect(expectedField).toBeDefined();
    expect(body).toHaveProperty(field);
    expect(body[field]).toBe(expectedField);
  },
);
