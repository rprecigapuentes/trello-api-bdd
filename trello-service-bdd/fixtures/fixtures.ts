import { CardClient } from '../api/clients/CardClient';
import { BoardClient } from '../api/clients/BoardClient';
import { ListClient } from '../api/clients/ListClient';
import { MemberClient } from '../api/clients/MemberClient';
import { BackgroundApiClient } from '../api/clients/BackgroundClient';
import { SearchClient } from '../api/clients/SearchClient';
import { OrganizationClient } from '../api/clients/OrganizationClient';
import {
  TrelloBoardSchema,
  TrelloListSchema,
  TrelloCardSchema,
  TrelloMemberSchema,
  TrelloBoardStarSchema,
} from '../api/schemas/trelloSchemas';
import { TrelloBoardBackground } from '../api/schemas/backgroundSchemas';
import type { APIResponse } from '@playwright/test';
import { OrganizationSchema } from '../api/schemas/organizationSchemas';
import { test as base } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '@core';
import { AuthStrategyFactory, AuthType } from '../api/auth/auth-strategy.factory';
import { IAuthStrategy } from '../api/auth/auth-strategy.interface';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface ScenarioState {
  board?: TrelloBoardSchema;
  createdBoards?: string[];
  list?: TrelloListSchema;
  targetList?: TrelloListSchema;
  destList?: TrelloListSchema;
  createdCard?: TrelloCardSchema | Record<string, unknown>;
  card?: TrelloCardSchema;
  member?: TrelloMemberSchema;
  background?: TrelloBoardBackground;
  response?: APIResponse;
  lastResponse?: APIResponse;
  [key: string]: unknown;
  boardStar?: TrelloBoardStarSchema;
  organization?: OrganizationSchema;
  generated: Record<string, string>;
  createdOrganizationIds: string[];
}
type MyFixtures = {
  authStrategy: IAuthStrategy;
  cardClient: CardClient;
  boardClient: BoardClient;
  listClient: ListClient;
  memberClient: MemberClient;
  scenarioState: ScenarioState;
  organizationClient: OrganizationClient;
  backgroundApi: BackgroundApiClient;
  searchClient: SearchClient;
};

export const test = base.extend<MyFixtures>({
  authStrategy: async ({}, use) => {
    const authType = (process.env.AUTH_TYPE as AuthType) || 'oauth1';
    logger.info(`Using auth strategy: ${authType}`);
    await use(AuthStrategyFactory.create(authType));
  },

  cardClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Card Client fixture...');
    await use(new CardClient(request, authStrategy));
  },
  boardClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Board Client fixture...');
    await use(new BoardClient(request, authStrategy));
  },
  listClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing List Client fixture...');
    await use(new ListClient(request, authStrategy));
  },
  memberClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Member Client fixture...');
    await use(new MemberClient(request, authStrategy));
  },
  searchClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Search Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new SearchClient(request, authStrategy);
    await use(client);
  },
  backgroundApi: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Background API Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new BackgroundApiClient(request, authStrategy, 'trello-service-bdd');
    await use(client);
  },
  organizationClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Organization Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new OrganizationClient(request, authStrategy);
    await use(client);
  },
  scenarioState: async ({}, use) => {
    const state: ScenarioState = { generated: {}, createdOrganizationIds: [] };
    await use(state);
  },
});
