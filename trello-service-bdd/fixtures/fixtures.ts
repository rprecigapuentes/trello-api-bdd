import { CardClient } from '../api/clients/CardClient';
import { BoardClient } from '../api/clients/BoardClient';
import { ListClient } from '../api/clients/ListClient';
import { MemberClient } from '../api/clients/MemberClient';
import {
  TrelloBoardSchema,
  TrelloListSchema,
  TrelloCardSchema,
  TrelloMemberSchema,
  TrelloBoardStarSchema,
} from '../api/schemas/trelloSchemas';
import type { APIResponse } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '@core';
import { AuthStrategyFactory, AuthType } from '../api/auth/auth-strategy.factory';
import { IAuthStrategy } from '../api/auth/auth-strategy.interface';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface ScenarioState {
  board?: TrelloBoardSchema;
  list?: TrelloListSchema;
  card?: TrelloCardSchema;
  member?: TrelloMemberSchema;
  response?: APIResponse;
  boardStar?: TrelloBoardStarSchema;
}

type MyFixtures = {
  authStrategy: IAuthStrategy;
  cardClient: CardClient;
  boardClient: BoardClient;
  listClient: ListClient;
  memberClient: MemberClient;
  scenarioState: ScenarioState;
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
  scenarioState: async ({}, use) => {
    await use({});
  },
});
