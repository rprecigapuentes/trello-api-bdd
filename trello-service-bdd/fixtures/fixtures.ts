import { CardClient } from '../api/clients/CardClient';
import { BoardClient } from '../api/clients/BoardClient';
import { ListClient } from '../api/clients/ListClient';
import {
  TrelloBoardSchema,
  TrelloListSchema,
  TrelloCardSchema,
} from '../api/schemas/trelloSchemas';
import { test as base } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '@core';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface ScenarioState {
  board?: TrelloBoardSchema;
  list?: TrelloListSchema;
  card?: TrelloCardSchema;
}

type MyFixtures = {
  cardClient: CardClient;
  boardClient: BoardClient;
  listClient: ListClient;
  scenarioState: ScenarioState;
};

export const test = base.extend<MyFixtures>({
  cardClient: async ({ request }, use) => {
    logger.info('Initializing Card Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new CardClient(request);
    await use(client);
  },
  boardClient: async ({ request }, use) => {
    logger.info('Initializing Board Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new BoardClient(request);
    await use(client);
  },
  listClient: async ({ request }, use) => {
    logger.info('Initializing List Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new ListClient(request);
    await use(client);
  },
  scenarioState: async ({}, use) => {
    await use({});
  },
});
