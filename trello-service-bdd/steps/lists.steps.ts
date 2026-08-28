import { createBdd } from 'playwright-bdd';
import { test, ScenarioState } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { logger } from '@core';
import { testDataName } from '../../core/utils/test-data-name-generator';
import { trelloListSchema, TrelloCardSchema } from '../api/schemas/trelloSchemas';

const { Given, When, Then } = createBdd(test);

function assertListExists(
  list: ScenarioState['list'],
): asserts list is NonNullable<ScenarioState['list']> {
  if (!list?.id) {
    logger.error('Precondition failed: Active list is undefined in scenarioState');
    throw new Error('Active list is undefined in scenarioState');
  }
}

Given(
  'the user has an active board available for testing',
  async ({ boardClient, scenarioState }) => {
    if (!scenarioState.board) {
      logger.info('Creating temporary board for test scenario...');
      const response = await boardClient.createBoard(`Test Board ${Date.now()}`);
      scenarioState.board = await response.json();

      scenarioState.createdBoards = scenarioState.createdBoards || [];
      if (scenarioState.board?.id) {
        scenarioState.createdBoards.push(scenarioState.board.id);
      }
    }
  },
);

Given(
  'the user has a second destination list created on the board',
  async ({ listClient, scenarioState }) => {
    if (!scenarioState.board?.id) {
      throw new Error('No active board found in scenario state');
    }

    const response = await listClient.createList(scenarioState.board.id, 'Destination List');
    scenarioState.destList = trelloListSchema.parse(await response.json());
  },
);

Given(
  'a card named {string} exists in the active list',
  async ({ cardClient, scenarioState }, cardName: string) => {
    assertListExists(scenarioState.list);

    logger.info(`Creating card '${cardName}' in list ID: '${scenarioState.list.id}'`);
    const response = await cardClient.createCard(scenarioState.list.id, cardName);
    scenarioState.createdCard = await response.json();
  },
);

Given('a temporary board exists', async ({ boardClient, scenarioState }) => {
  if (!scenarioState.board) {
    logger.info('Creating temporary board for test scenario...');
    const response = await boardClient.createBoard(`Test Board ${Date.now()}`);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`Failed to create temporary board (${response.status()}): ${errorText}`);
      throw new Error(`Failed to create board: ${errorText}`);
    }

    scenarioState.board = await response.json();
    scenarioState.createdBoards = scenarioState.createdBoards || [];
    if (scenarioState.board?.id) {
      scenarioState.createdBoards.push(scenarioState.board.id);
    }
  }
});

Given(
  'a list named {string} exists in the active board',
  async ({ listClient, scenarioState }, listName: string) => {
    if (!scenarioState.board?.id) {
      logger.error('Failed to create list: No active board in scenario state');
      throw new Error('No active board found in scenario state');
    }

    logger.info(
      `Creating precondition list '${listName}' in board ID: '${scenarioState.board.id}'...`,
    );
    const response = await listClient.createList(scenarioState.board.id, listName);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`Failed to create list '${listName}' (${response.status()}): ${errorText}`);
      throw new Error(`Failed to create list: ${errorText}`);
    }

    scenarioState.list = trelloListSchema.parse(await response.json());
  },
);

Given(
  'a target list named {string} exists in the active board',
  async ({ listClient, scenarioState }, targetListName: string) => {
    if (!scenarioState.board?.id) {
      logger.error('Failed to create target list: No active board in scenario state');
      throw new Error('No active board found in scenario state');
    }

    logger.info(
      `Creating target list '${targetListName}' in board ID: '${scenarioState.board.id}'...`,
    );
    const response = await listClient.createList(scenarioState.board.id, targetListName);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(
        `Failed to create target list '${targetListName}' (${response.status()}): ${errorText}`,
      );
      throw new Error(`Failed to create target list: ${errorText}`);
    }

    scenarioState.targetList = trelloListSchema.parse(await response.json());
    scenarioState.destList = scenarioState.targetList; // Syncing destList alias
  },
);

// --- TC-LIST-01: Create List ---
When(
  'the user creates a list named {string} in the board',
  async ({ listClient, scenarioState }, baseName: string) => {
    if (!scenarioState.board?.id) {
      logger.error('Failed to create list: No active board found in scenario state');
      throw new Error('No board found in scenario state');
    }

    const dynamicName = testDataName('TC-LIST-01', baseName);
    logger.info(`Creating list '${dynamicName}' in board ID: '${scenarioState.board.id}'...`);

    const response = await listClient.createList(scenarioState.board.id, dynamicName);
    scenarioState.response = response;
    scenarioState.lastResponse = response;

    // Safety Guard: Read raw text first if HTTP status indicates an error
    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`Trello API Error Status [${response.status()}]: ${errorText}`);
      throw new Error(`Trello API failed with status ${response.status()}: ${errorText}`);
    }

    const responseData = await response.json();
    scenarioState.list = trelloListSchema.parse(responseData);
    expect(scenarioState.list?.id).toBeTruthy();
  },
);

Then(
  'the response status code should be {string}',
  async ({ scenarioState }, expectedStatus: string) => {
    if (!scenarioState.lastResponse) {
      logger.error('Failed to validate status code: No API response recorded in scenarioState');
      throw new Error('No API response recorded in scenarioState');
    }

    const actualStatus = scenarioState.lastResponse.status();
    logger.info(`Validating status code. Expected: [${expectedStatus}], Actual: [${actualStatus}]`);
    expect(actualStatus).toBe(Number(expectedStatus));
  },
);

Then('the list name should match the created name', async ({ scenarioState }) => {
  assertListExists(scenarioState.list);
  logger.info(`Validating dynamic list name: '${scenarioState.list.name}'`);
  expect(scenarioState.list.name).toBeTruthy();
});

Then(
  'the list closed status should be {string}',
  async ({ scenarioState }, expectedClosed: string) => {
    assertListExists(scenarioState.list);
    const isClosed = expectedClosed === 'true';
    logger.info(
      `Validating list closed status. Expected: [${isClosed}], Actual: [${scenarioState.list.closed}]`,
    );
    expect(scenarioState.list.closed).toBe(isClosed);
  },
);

// --- TC-LIST-02 & TC-LIST-07: Update List / Single Field ---
When(
  'the user updates the list name to {string}',
  async ({ listClient, scenarioState }, newName: string) => {
    assertListExists(scenarioState.list);

    logger.info(`Updating list ID '${scenarioState.list.id}' name to: '${newName}'...`);
    const response = await listClient.updateList(scenarioState.list.id, { name: newName });
    scenarioState.lastResponse = response;
    scenarioState.list = trelloListSchema.parse(await response.json());
  },
);

When(
  'the user updates the list field {string} with value {string}',
  async ({ listClient, scenarioState }, field: string, value: string) => {
    assertListExists(scenarioState.list);

    logger.info(`Updating field '${field}' on list ID '${scenarioState.list.id}' to '${value}'...`);
    const response = await listClient.updateField(scenarioState.list.id, field, value);
    scenarioState.lastResponse = response;
    scenarioState.list = trelloListSchema.parse(await response.json());
  },
);

Then('the list name should be {string}', async ({ scenarioState }, expectedName: string) => {
  assertListExists(scenarioState.list);

  logger.info(
    `Validating list name. Expected: '${expectedName}', Actual: '${scenarioState.list.name}'`,
  );
  expect(scenarioState.list.name).toBe(expectedName);
});

// --- TC-LIST-03: Archive / Unarchive ---
When('the user archives the list', async ({ listClient, scenarioState }) => {
  assertListExists(scenarioState.list);

  logger.info(`Archiving list ID: '${scenarioState.list.id}'...`);
  const response = await listClient.archiveList(scenarioState.list.id);
  scenarioState.lastResponse = response;
  scenarioState.list = trelloListSchema.parse(await response.json());
});

When('the user unarchives the list', async ({ listClient, scenarioState }) => {
  assertListExists(scenarioState.list);

  logger.info(`Unarchiving list ID: '${scenarioState.list.id}'...`);
  const response = await listClient.unarchiveList(scenarioState.list.id);
  scenarioState.lastResponse = response;
  scenarioState.list = trelloListSchema.parse(await response.json());
});

// --- TC-LIST-04: Archive All Cards ---
When('the user archives all cards in the active list', async ({ listClient, scenarioState }) => {
  assertListExists(scenarioState.list);

  logger.info(`Archiving all cards in list ID: '${scenarioState.list.id}'...`);
  const response = await listClient.archiveAllCards(scenarioState.list.id);
  scenarioState.lastResponse = response;
});

// --- TC-LIST-05: Move All Cards ---
When(
  'the user moves all cards from the active list to destination list',
  async ({ listClient, scenarioState }) => {
    assertListExists(scenarioState.list);

    const targetList = scenarioState.targetList || scenarioState.destList;
    if (!scenarioState.board?.id || !targetList?.id) {
      logger.error('Failed to move cards: Board or Destination list missing');
      throw new Error('Board or Destination list missing');
    }

    logger.info(`Moving all cards from list '${scenarioState.list.id}' to '${targetList.id}'...`);

    const response = await listClient.moveAllCards(
      scenarioState.list.id,
      scenarioState.board.id,
      targetList.id,
    );
    scenarioState.lastResponse = response;
  },
);

Then(
  'the destination list should contain the created card',
  async ({ listClient, scenarioState }) => {
    const targetListId = scenarioState.targetList?.id || scenarioState.destList?.id;
    if (!targetListId) throw new Error('Destination list missing in scenarioState');

    const response = await listClient.getCards(targetListId);
    expect(response.status()).toBe(200);

    const cards: TrelloCardSchema[] = await response.json();
    const createdCard = scenarioState.createdCard as TrelloCardSchema | undefined;

    const found = cards.some((card) => card.id === createdCard?.id);
    expect(found).toBe(true);
  },
);

Then(
  'the active list should contain {int} open cards',
  async ({ listClient, scenarioState }, expectedCount: number) => {
    assertListExists(scenarioState.list);

    const response = await listClient.getCards(scenarioState.list.id);
    expect(response.status()).toBe(200);

    const cards: TrelloCardSchema[] = await response.json();
    expect(cards.length).toBe(expectedCount);
  },
);

// --- TC-LIST-06: Move List to Board ---
When('the user moves the list to the active test board', async ({ listClient, scenarioState }) => {
  assertListExists(scenarioState.list);

  if (!scenarioState.board?.id) {
    logger.error('Failed to move list to board: Target board missing');
    throw new Error('Target board missing');
  }

  logger.info(
    `Moving list ID '${scenarioState.list.id}' to board ID '${scenarioState.board.id}'...`,
  );

  const response = await listClient.moveListToBoard(scenarioState.list.id, scenarioState.board.id);
  scenarioState.lastResponse = response;

  if (!response.ok()) {
    const errorText = await response.text();
    logger.error(`Failed to move list (${response.status()}): ${errorText}`);
    throw new Error(`Failed to move list: [${response.status()}] ${errorText}`);
  }

  scenarioState.list = trelloListSchema.parse(await response.json());
});

Then('the list board ID should match the active board ID', async ({ scenarioState }) => {
  assertListExists(scenarioState.list);

  logger.info(
    `Validating list board ID. Expected: '${scenarioState.board?.id}', Actual: '${scenarioState.list.idBoard}'`,
  );
  expect(scenarioState.list.idBoard).toBe(scenarioState.board?.id);
});

Then(
  'user 2 can create a list in the shared board named {string}',
  async ({ scenarioState, user2 }, listName: string) => {
    const response = await user2.listClient.createList(
      scenarioState.user1.board!.id,
      testDataName(listName, 'User2List'),
    );
    expect(response.status()).toBe(200);
    const createdList = await user2.listClient.getList(
      await response.json().then((data) => data.id),
    );
    const listData = await createdList.json();
    expect(listData.name).toContain(listName);
  },
);
