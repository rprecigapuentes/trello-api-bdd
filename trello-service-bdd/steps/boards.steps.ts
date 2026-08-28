import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { logger, testDataName } from '@core';

const { Given, When, Then } = createBdd(test);

Given(
  'I create a new board named {string}',
  async ({ boardClient, scenarioState }, name: string) => {
    logger.info(`Creating Trello board with title: ${name}`);
    const response = await boardClient.createBoard(name);
    scenarioState.board = await response.json();
    logger.debug(`POST /1/boards - Board ID created: ${scenarioState.board?.id}`);
    expect(scenarioState.board?.id).toBeTruthy();
  },
);

When('I fetch the board details', async ({ boardClient, scenarioState }) => {
  if (!scenarioState.board?.id) throw new Error('No active board found');
  logger.info(`Fetching details for board ID: ${scenarioState.board.id}`);
  const response = await boardClient.getBoard(scenarioState.board.id);
  scenarioState.board = await response.json();
  logger.debug(`GET /1/boards/${scenarioState.board?.id} - Status 200 OK`);
});

Then('the board name should be {string}', async ({ scenarioState }, expectedName: string) => {
  logger.info(
    `Validating board name. Expected: "${expectedName}", Actual: "${scenarioState.board?.name}"`,
  );
  expect(scenarioState.board?.name).toBe(expectedName);
});

When(
  'I update the board name to {string}',
  async ({ boardClient, scenarioState }, newName: string) => {
    if (!scenarioState.board?.id) throw new Error('No active board found');

    logger.info(`Updating board ID ${scenarioState.board.id} name to: ${newName}`);
    const response = await boardClient.updateBoard(scenarioState.board.id, {
      name: newName,
    });
    scenarioState.board = await response.json();
    logger.debug(`PUT /1/boards/${scenarioState.board?.id} - Success`);
  },
);

Then('I clean up by deleting the board', async ({ boardClient, scenarioState }) => {
  if (scenarioState.board?.id) {
    logger.info(`Tearing down test: Deleting board ID ${scenarioState.board.id}`);
    await boardClient.deleteBoard(scenarioState.board.id);
    logger.debug(`DELETE /1/boards/${scenarioState.board.id} - Success`);
    scenarioState.board = undefined;
  }
});

//This includes 2 steps that are written differently, but they made the same
Given(
  /^the member has (?:a|at least one) board named "([^"]+)"$/,
  async ({ scenarioState, boardClient }, boardNameParam: string) => {
    const boardName = testDataName(boardNameParam, 'Board');
    const response = await boardClient.createBoard(boardName);
    const board = await response.json();
    scenarioState.board = board;
    expect(board.id).toBeTruthy();
  },
);

Given('the member has no boards', async ({ boardClient, memberClient }) => {
  const response = await memberClient.getMyMember();
  const member = await response.json();
  for (const boardId of member.idBoards) {
    await boardClient.deleteBoard(boardId);
  }
  logger.info(`List of boards for member ID ${member.id}: ${member.idBoards.join(', ')}`);
});

When(
  String.raw`the user sends a DELETE request to \/boards\/\{boardId\}`,
  async ({ boardClient, scenarioState }) => {
    const response = await boardClient.deleteBoard(scenarioState.board!.id);
    expect(response.status()).toBe(200);
    logger.debug(`DELETE /1/boards/${scenarioState.board!.id} - Status ${response.status()}`);
  },
);

Given(
  'user 1 has created a new board named {string}',
  async ({ user1, scenarioState }, boardName: string) => {
    const response = await user1.boardClient.createBoard(boardName);
    const board = await response.json();
    scenarioState.user1.board = board;
    scenarioState.board = board; // Store the created board in the scenario state for later use
    expect(board.id).toBeTruthy();
    logger.info(
      `User 1 created a new board with ID: ${scenarioState.user1.board?.id} and name: ${boardName}`,
    );
  },
);

When('user 1 invites user 2 to the board', async ({ user1, scenarioState }) => {
  const response = await user1.memberClient.addMemberToBoard(
    scenarioState.user1.board!.id,
    scenarioState.user2.member!.id,
    'admin',
  );
  expect(response.status()).toBe(200);
});
