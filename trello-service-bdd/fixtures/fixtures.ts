import { APIResponse } from '@playwright/test';
import { CardClient } from '../api/clients/CardClient';
import { BoardClient } from '../api/clients/BoardClient';
import { ListClient } from '../api/clients/ListClient';
import { MemberClient } from '../api/clients/MemberClient';
import { SearchClient } from '../api/clients/SearchClient';
import { OrganizationClient } from '../api/clients/OrganizationClient';
import {
  TrelloBoardSchema,
  TrelloListSchema,
  TrelloCardSchema,
  TrelloMemberSchema,
  TrelloBoardStarSchema,
} from '../api/schemas/trelloSchemas';
import { OrganizationSchema } from '../api/schemas/organizationSchemas';
import { test as base } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '@core';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface ScenarioState {
  board?: TrelloBoardSchema;
  list?: TrelloListSchema;
  card?: TrelloCardSchema;
  member?: TrelloMemberSchema;
  response?: APIResponse;
  boardStar?: TrelloBoardStarSchema;
  organization?: OrganizationSchema;
  generated: Record<string, string>;
  createdOrganizationIds: string[];
}

type MyFixtures = {
  cardClient: CardClient;
  boardClient: BoardClient;
  listClient: ListClient;
  organizationClient: OrganizationClient;
  scenarioState: ScenarioState;
  memberClient: MemberClient;
  searchClient: SearchClient;
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
  memberClient: async ({ request }, use) => {
    logger.info('Initializing Member Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new MemberClient(request);
    await use(client);
  },
  searchClient: async ({ request }, use) => {
    logger.info('Initializing Search Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new SearchClient(request);
    await use(client);
  },
  organizationClient: async ({ request }, use) => {
    logger.info('Initializing Organization Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new OrganizationClient(request);
    await use(client);
  },
  scenarioState: async ({}, use) => {
    const state: ScenarioState = { generated: {}, createdOrganizationIds: [] };
    await use(state);
  },
});
