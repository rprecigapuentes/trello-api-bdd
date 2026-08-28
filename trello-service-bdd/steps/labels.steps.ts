import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { logger, testDataName } from '@core';
import { expect } from '@playwright/test';
import { zephyrKey } from '../../core/utils/zephyr-key';

const { Given, When, Then } = createBdd(test);

// Given steps

Given('a board exists', async ({ scenarioState, boardClient, $testInfo }) => {
  const name = testDataName(zephyrKey($testInfo.tags), 'Board');
  const response = await boardClient.createBoard(name);
  expect(response.ok()).toBe(true);
  scenarioState.board = await response.json();
  logger.info(`Created board with ID: ${scenarioState.board!.id} for scenario: ${$testInfo.title}`);
});

Given('a label exists on that board', async ({ scenarioState, labelClient, $testInfo }) => {
  const name = testDataName(zephyrKey($testInfo.tags), 'Label');
  const color = 'green';
  const response = await labelClient.create({ name, color, idBoard: scenarioState.board!.id });
  expect(response.ok()).toBe(true);
  scenarioState.generated.name = name;
  scenarioState.generated.color = color;
  scenarioState.label = await response.json();
});

// When steps

When(
  'the user creates a label on that board with a generated name and color {string}',
  async ({ scenarioState, labelClient, $testInfo }, color: string) => {
    const name = testDataName(zephyrKey($testInfo.tags), 'Label');
    scenarioState.generated.name = name;
    scenarioState.generated.color = color;
    scenarioState.response = await labelClient.create({
      name,
      color,
      idBoard: scenarioState.board!.id,
    });
    if (scenarioState.response.ok()) {
      scenarioState.label = await scenarioState.response.json();
      logger.info(
        `Created label with ID: ${scenarioState.label!.id}, name: ${name} and color: ${color} on board: ${scenarioState.board!.id}`,
      );
    }
  },
);

When(
  'the user creates a label on that board with a generated name omitting color',
  async ({ scenarioState, labelClient, $testInfo }) => {
    const name = testDataName(zephyrKey($testInfo.tags), 'Label');
    scenarioState.generated.name = name;
    scenarioState.response = await labelClient.create({ name, idBoard: scenarioState.board!.id });
  },
);

When(
  'the user creates a label on the board with id {string} with a generated name and color {string}',
  async ({ scenarioState, labelClient, $testInfo }, boardId: string, color: string) => {
    const name = testDataName(zephyrKey($testInfo.tags), 'Label');
    scenarioState.generated.name = name;
    scenarioState.response = await labelClient.create({ name, color, idBoard: boardId });
  },
);

When('the user updates the label sending no parameters', async ({ scenarioState, labelClient }) => {
  scenarioState.response = await labelClient.update(scenarioState.label!.id, {});
  if (scenarioState.response.ok()) {
    scenarioState.label = await scenarioState.response.json();
  }
});

When(
  'the user updates the label with a generated name and color {string}',
  async ({ scenarioState, labelClient, $testInfo }, color: string) => {
    const name = testDataName(zephyrKey($testInfo.tags), 'Label');
    scenarioState.generated.name = name;
    scenarioState.generated.color = color;
    scenarioState.response = await labelClient.update(scenarioState.label!.id, { name, color });
    if (scenarioState.response.ok()) {
      scenarioState.label = await scenarioState.response.json();
      logger.info(
        `Updated label with ID: ${scenarioState.label!.id} to name: ${name} and color: ${color}`,
      );
    }
  },
);

When(
  'the user updates the label with id {string} with a generated name',
  async ({ scenarioState, labelClient, $testInfo }, labelId: string) => {
    const name = testDataName(zephyrKey($testInfo.tags), 'Label');
    scenarioState.generated.name = name;
    scenarioState.response = await labelClient.update(labelId, { name });
  },
);

When('the user deletes the label', async ({ scenarioState, labelClient }) => {
  const labelId = scenarioState.label!.id;
  scenarioState.response = await labelClient.delete(labelId);
  if (scenarioState.response.ok()) {
    logger.info(`Deleted label with ID: ${labelId}`);
  }
});

// Then steps

Then(
  'the response contains a label with the generated name and color {string}',
  async ({ scenarioState }, color: string) => {
    const body = await scenarioState.response!.json();
    expect(body.id).toBeTruthy();
    expect(body.name).toBe(scenarioState.generated.name);
    expect(body.color).toBe(color);
  },
);

Then('the response contains a label bound to that board', async ({ scenarioState }) => {
  const body = await scenarioState.response!.json();
  expect(body.idBoard).toBe(scenarioState.board!.id);
});

Then('the response contains the label with every field unchanged', async ({ scenarioState }) => {
  const body = await scenarioState.response!.json();
  for (const [field, expectedValue] of Object.entries(scenarioState.generated)) {
    expect(body).toHaveProperty(field);
    expect(body[field]).toBe(expectedValue);
  }
});

Then(
  'a request for the deleted label returns status 404',
  async ({ scenarioState, labelClient }) => {
    const labelId = scenarioState.label!.id;
    const response = await labelClient.get(labelId);
    logger.info(
      `Requesting deleted label with ID: ${labelId}. Expected status: 404, Actual status: ${response.status()}`,
    );
    expect(response.status()).toBe(404);
  },
);
