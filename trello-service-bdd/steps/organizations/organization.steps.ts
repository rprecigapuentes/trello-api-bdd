import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/fixtures';
import { testDataName, testDataSlug } from '@core';
import { expect } from '@playwright/test';
import { logger } from '@core/utils/logger';
import { zephyrKey } from '@core/utils/zephyr-key';

const { Given, When, Then } = createBdd(test);

// Given steps

Given(
  'the member has at least one organization named {string}',
  async ({ scenarioState, organizationClient }, dataName: string) => {
    const displayName = testDataName(dataName, 'Organization');
    scenarioState.generated.displayName = displayName;
    const response = await organizationClient.create({ displayName });
    expect(response.ok()).toBe(true);
    const organization = await response.json();
    scenarioState.organization = organization;
    scenarioState.createdOrganizationIds.push(organization.id);
  },
);

Given('an organization exists', async ({ scenarioState, organizationClient, $testInfo }) => {
  const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
  scenarioState.generated.displayName = displayName;
  const response = await organizationClient.create({ displayName });
  expect(response.ok()).toBe(true);
  const organization = await response.json();
  scenarioState.organization = organization;
  scenarioState.createdOrganizationIds.push(organization.id);
});

Given(
  'an organization exists with a logo already set',
  async ({ scenarioState, organizationClient, $testInfo }) => {
    const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
    scenarioState.generated.displayName = displayName;
    const response = await organizationClient.create({ displayName });
    expect(response.ok()).toBe(true);
    const organization = await response.json();
    scenarioState.organization = organization;
    scenarioState.createdOrganizationIds.push(organization.id);
    const responseLogo = await organizationClient.setLogo(organization.id, 'jalasoft_logo.jpg');
    expect(responseLogo.ok()).toBe(true);
    const logo = await responseLogo.json();
    scenarioState.logoHash = logo.logoHash;
  },
);

// When steps

When(
  'the user creates an organization with a generated displayName',
  async ({ organizationClient, scenarioState, $testInfo }) => {
    const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
    scenarioState.generated.displayName = displayName;
    scenarioState.response = await organizationClient.create({ displayName });
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
      scenarioState.createdOrganizationIds.push(scenarioState.organization!.id);
      logger.info(
        `Created organization with ID: ${scenarioState.organization!.id} and displayName: ${scenarioState.generated.displayName} after scenario: ${$testInfo.title}`,
      );
    }
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
      logger.info(
        `Created organization with ID: ${scenarioState.organization!.id}, displayName: ${scenarioState.generated.displayName}, name: ${scenarioState.generated.name}, website: ${scenarioState.generated.website} and description: ${scenarioState.generated.desc} after scenario: ${$testInfo.title}`,
      );
    }
  },
);

When(
  'the user creates an organization omitting displayName',
  async ({ organizationClient, scenarioState }) => {
    scenarioState.response = await organizationClient.create({});
  },
);

When(
  'the user creates a board inside that organization',
  async ({ boardClient, scenarioState, $testInfo }) => {
    const name = testDataName(zephyrKey($testInfo.tags), 'Board');
    scenarioState.response = await boardClient.createBoard(name, scenarioState.organization!.id);
    if (scenarioState.response.ok()) {
      scenarioState.board = await scenarioState.response.json();
      logger.info(
        `Created board with ID: ${scenarioState.board!.id} inside organization: ${scenarioState.organization!.id}`,
      );
    }
  },
);

When(
  'the user updates the organization sending no parameters',
  async ({ organizationClient, scenarioState }) => {
    const orgId = scenarioState.organization!.id;
    scenarioState.response = await organizationClient.update(orgId, {});
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
    }
  },
);

When(
  'the user updates the organization with a generated displayName, a generated name, desc {string} and website {string}',
  async ({ organizationClient, scenarioState, $testInfo }, desc: string, website: string) => {
    const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
    const name = testDataSlug(zephyrKey($testInfo.tags), 'Organization');
    scenarioState.generated.displayName = displayName;
    scenarioState.generated.name = name;
    scenarioState.generated.desc = desc;
    scenarioState.generated.website = website;
    const orgId = scenarioState.organization!.id;
    scenarioState.response = await organizationClient.update(orgId, {
      displayName,
      name,
      desc,
      website,
    });
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
      logger.info(
        `Updated organization with ID: ${scenarioState.organization!.id}, displayName: ${scenarioState.generated.displayName}, name: ${scenarioState.generated.name}, website: ${scenarioState.generated.website} and description: ${scenarioState.generated.desc} after scenario: ${$testInfo.title}`,
      );
    }
  },
);

When(
  'the user updates the organization with a generated displayName',
  async ({ organizationClient, scenarioState, $testInfo }) => {
    const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
    scenarioState.generated.displayName = displayName;
    scenarioState.response = await organizationClient.update(scenarioState.organization!.id, {
      displayName,
    });
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
      logger.info(
        `Updated organization with ID: ${scenarioState.organization!.id} to displayName: ${displayName}`,
      );
    }
  },
);

When(
  'the user updates the organization with id {string} with a generated displayName',
  async ({ organizationClient, scenarioState, $testInfo }, orgId: string) => {
    const displayName = testDataName(zephyrKey($testInfo.tags), 'Organization');
    scenarioState.generated.displayName = displayName;
    scenarioState.response = await organizationClient.update(orgId, { displayName });
  },
);

When('the user deletes the organization', async ({ organizationClient, scenarioState }) => {
  const orgId = scenarioState.organization!.id;
  scenarioState.response = await organizationClient.deleteOrganization(orgId);
  if (scenarioState.response.ok()) {
    logger.info(`Deleted organization with ID: ${orgId}`);
  }
});

When(
  'the user deletes the organization with id {string}',
  async ({ organizationClient, scenarioState }, orgId: string) => {
    scenarioState.response = await organizationClient.deleteOrganization(orgId);
  },
);

When(
  'the user updates the organization logo sending no parameters',
  async ({ organizationClient, scenarioState }) => {
    const orgId = scenarioState.organization!.id;
    scenarioState.response = await organizationClient.setLogoWithoutFile(orgId);
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
      logger.info(`Updated organization logo with ID: ${scenarioState.organization!.id}`);
    }
  },
);

When(
  'the user updates the organization logo with the file {string}',
  async ({ organizationClient, scenarioState }, fileName: string) => {
    const orgId = scenarioState.organization!.id;
    scenarioState.response = await organizationClient.setLogo(orgId, fileName);
    if (scenarioState.response.ok()) {
      scenarioState.organization = await scenarioState.response.json();
      logger.info(`Updated organization logo with ID: ${scenarioState.organization!.id}`);
    }
  },
);

When('the user deletes the organization logo', async ({ organizationClient, scenarioState }) => {
  const orgId = scenarioState.organization!.id;
  scenarioState.response = await organizationClient.deleteLogo(orgId);
  if (scenarioState.response.ok()) {
    logger.info(`Deleted organization logo with ID: ${orgId}`);
  }
});

// Then steps

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

Then(
  'the response contains the organization with every field unchanged',
  async ({ scenarioState }) => {
    const expectedFields = scenarioState.generated;
    const body = await scenarioState.response!.json();
    for (const [field, expectedValue] of Object.entries(expectedFields)) {
      expect(body).toHaveProperty(field);
      expect(body[field]).toBe(expectedValue);
    }
  },
);

Then(
  'a request for the deleted organization returns status 404',
  async ({ organizationClient, scenarioState }) => {
    const orgId = scenarioState.organization!.id;
    const response = await organizationClient.getOrganization(orgId);
    logger.info(
      `Requesting deleted organization with ID: ${orgId}. Expected status: 404, Actual status: ${response.status()}`,
    );
    expect(response.status()).toBe(404);
  },
);

Then('the response contains the organization with the same logoHash', async ({ scenarioState }) => {
  const expectedLogoHash = scenarioState.logoHash;
  const body = await scenarioState.response!.json();
  expect(expectedLogoHash).toBeDefined();
  expect(body).toHaveProperty('logoHash');
  expect(body.logoHash).toBe(expectedLogoHash);
});

Then(
  'the response contains the organization with a non-empty logoHash',
  async ({ scenarioState }) => {
    const body = await scenarioState.response!.json();
    expect(body).toHaveProperty('logoHash');
    expect(body.logoHash).toBeTruthy();
  },
);

Then('the organization has no logoHash', async ({ organizationClient, scenarioState }) => {
  const orgId = scenarioState.organization!.id;
  const response = await organizationClient.getOrganization(orgId);
  const body = await response.json();
  expect(response.status()).toBe(200);
  expect(body.logoHash).toBeNull();
});
