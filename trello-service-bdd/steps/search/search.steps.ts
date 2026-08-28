import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/fixtures';
import { expect } from '@playwright/test';
import { logger } from '@core';

const { When, Then } = createBdd(test);

When(
  String.raw`the user sends a GET request to \/search?query={string}`,
  async ({ searchClient, scenarioState }, query: string) => {
    const response = await searchClient.search(query);
    scenarioState.response = response;
    console.log(`Search query: ${query}, Response status: ${response.status()}`);
    console.log(`Response body: ${await response.json()}`);
  },
);

Then(
  'the response contains only {string} {string} in the {string} array',
  async ({ scenarioState }, itemName: string, fieldName: string, arrayName: string) => {
    const responseBody = await scenarioState.response?.json();
    expect(responseBody[arrayName]).toBeDefined();

    const items = responseBody[arrayName];
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      logger.error(`Checking item: ${item[fieldName]} against expected: ${itemName}`);
      expect(item[fieldName]).toContain(itemName);
    }
  },
);

When(
  String.raw`the user sends a GET request to \/search?query with the member's username`,
  async ({ searchClient, scenarioState }) => {
    const response = await searchClient.search(scenarioState.member!.username);
    scenarioState.response = response;
  },
);

Then(
  'the response contains only the users that match the member\'s username in the "members" array',
  async ({ scenarioState }) => {
    const responseBody = await scenarioState.response?.json();
    expect(responseBody.members).toBeDefined();

    const members = responseBody.members;
    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);

    for (const member of members) {
      logger.error(
        `Checking member: ${member.username} against expected: ${scenarioState.member!.username}`,
      );
      expect(member.username).toContain(scenarioState.member!.username);
    }
  },
);

When('user 2 searches for the board', async ({ user2, scenarioState }) => {
  const response = await user2.searchClient.search(scenarioState.user1.board!.name);
  scenarioState.response = response;
  logger.info(`User 2 searched for the board named: ${scenarioState.user1.board!.name}`);
});

Then('user 2 can find the shared board', async ({ scenarioState }) => {
  const responseBody = await scenarioState.response?.json();
  expect(responseBody.boards).toBeDefined();

  expect(Array.isArray(responseBody.boards)).toBe(true);
  expect(responseBody.boards.length).toBeGreaterThan(0);

  const matchingBoard = responseBody.boards.find(
    (board: { id: string }) => board.id === scenarioState.user1.board!.id,
  );

  expect(matchingBoard?.id).toBe(scenarioState.user1.board!.id);
  logger.info(`User 2 found the shared board with ID: ${matchingBoard?.id}`);
});
