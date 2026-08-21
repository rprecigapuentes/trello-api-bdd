import { TrelloApiClient } from './api/trelloClient';
import { TrelloBoard, TrelloList, TrelloCard } from './api/trelloSchemas';
import { test as base } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '@core';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface ScenarioState {
  board?: TrelloBoard;
  list?: TrelloList;
  card?: TrelloCard;
}

type MyFixtures = {
  trelloApi: TrelloApiClient;
  scenarioState: ScenarioState;
};

export const test = base.extend<MyFixtures>({
  trelloApi: async ({ request }, use) => {
    logger.info('Initializing Trello API fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new TrelloApiClient(request);
    await use(client);
  },
  scenarioState: async ({}, use) => {
    await use({});
  },
});
