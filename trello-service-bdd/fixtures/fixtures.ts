import { CardClient } from '../api/clients/CardClient';
import { BoardClient } from '../api/clients/BoardClient';
import { ListClient } from '../api/clients/ListClient';
import { MemberClient } from '../api/clients/MemberClient';
import { SearchClient } from '../api/clients/SearchClient';
import { OrganizationClient } from '../api/clients/OrganizationClient';
import { NotificationClient } from '../api/clients/NotificationClient';
import { BackgroundClient } from '../api/clients/BackgroundClient';
import { CustomBackgroundClient } from '../api/clients/CustomBackgroundClient';
import { CustomEmojiClient } from '../api/clients/CustomEmojiClient';
import { CustomStickerClient } from '../api/clients/CustomStickerClient';
import { WebhookClient } from '../api/clients/WebhookClient';
import { WebhookSiteClient } from '../api/clients/WebhookSiteClient';
import { LabelClient } from '../api/clients/LabelClient';
import {
  TrelloBoardSchema,
  TrelloListSchema,
  TrelloCardSchema,
  TrelloMemberSchema,
  TrelloBoardStarSchema,
} from '../api/schemas/trelloSchemas';
import { TrelloBoardBackground } from '../api/schemas/backgroundSchemas';
import { CustomEmoji, CustomSticker } from '../api/schemas/customAssetSchemas';
import { Webhook } from '../api/schemas/webhookSchemas';
import type { APIResponse, APIRequestContext } from '@playwright/test';
import { OrganizationSchema } from '../api/schemas/organizationSchemas';
import { LabelSchema } from '../api/schemas/labelSchemas';
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
  emoji?: CustomEmoji;
  sticker?: CustomSticker;
  webhook?: Webhook;
  webhookToken?: string;
  response?: APIResponse;
  lastResponse?: APIResponse;
  [key: string]: unknown;
  boardStar?: TrelloBoardStarSchema;
  organization?: OrganizationSchema;
  label?: LabelSchema;
  generated: Record<string, string>;
  createdOrganizationIds: string[];
  user1: {
    member?: TrelloMemberSchema;
    board?: TrelloBoardSchema;
    list?: TrelloListSchema;
    card?: TrelloCardSchema;
  };
  user2: {
    member?: TrelloMemberSchema;
    board?: TrelloBoardSchema;
    list?: TrelloListSchema;
    card?: TrelloCardSchema;
  };
}

function buildClientsForUser(request: APIRequestContext, apiKey: string, apiToken: string) {
  const authType = (process.env.AUTH_TYPE as AuthType) || 'oauth1';
  const strategy = AuthStrategyFactory.create(authType, apiKey, apiToken);

  return {
    boardClient: new BoardClient(request, strategy),
    memberClient: new MemberClient(request, strategy),
    cardClient: new CardClient(request, strategy),
    listClient: new ListClient(request, strategy),
    organizationClient: new OrganizationClient(request, strategy, 'trello-service-bdd-2'),
    backgroundApi: new BackgroundClient(request, strategy, 'trello-service-bdd-2'),
    searchClient: new SearchClient(request, strategy),
  };
}

type UserClients = ReturnType<typeof buildClientsForUser>;

type MyFixtures = {
  authStrategy: IAuthStrategy;
  cardClient: CardClient;
  boardClient: BoardClient;
  listClient: ListClient;
  memberClient: MemberClient;
  scenarioState: ScenarioState;
  organizationClient: OrganizationClient;
  user1: UserClients;
  user2: UserClients;
  searchClient: SearchClient;
  notificationClient: NotificationClient;
  backgroundClient: BackgroundClient;
  customBackgroundClient: CustomBackgroundClient;
  customEmojiClient: CustomEmojiClient;
  customStickerClient: CustomStickerClient;
  webhookClient: WebhookClient;
  webhookSiteClient: WebhookSiteClient;
  labelClient: LabelClient;
};

export const test = base.extend<MyFixtures>({
  authStrategy: async ({}, use) => {
    const authType = (process.env.AUTH_TYPE as AuthType) || 'oauth1';
    const apiKey = process.env.TRELLO_API_KEY!;
    const apiToken = process.env.TRELLO_API_TOKEN!;
    logger.info(`Using auth strategy: ${authType}`);
    await use(AuthStrategyFactory.create(authType, apiKey, apiToken));
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
  backgroundClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Background API Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new BackgroundClient(request, authStrategy, 'trello-service-bdd');
    await use(client);
  },
  customBackgroundClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Custom Background API Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new CustomBackgroundClient(request, authStrategy, 'trello-service-bdd');
    await use(client);
  },
  searchClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Search Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new SearchClient(request, authStrategy);
    await use(client);
  },
  organizationClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Organization Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new OrganizationClient(request, authStrategy, 'trello-service-bdd');
    await use(client);
  },
  customEmojiClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Custom Emoji Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new CustomEmojiClient(request, authStrategy, 'trello-service-bdd');
    await use(client);
  },
  customStickerClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Custom Sticker Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new CustomStickerClient(request, authStrategy, 'trello-service-bdd');
    await use(client);
  },
  webhookClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Webhook Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new WebhookClient(request, authStrategy);
    await use(client);
  },
  webhookSiteClient: async ({ request }, use) => {
    logger.info('Initializing Webhook.site Client fixture...');
    const client = new WebhookSiteClient(request);
    await use(client);
  },
  notificationClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Notification Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new NotificationClient(request, authStrategy);
    await use(client);
  },
  labelClient: async ({ request, authStrategy }, use) => {
    logger.info('Initializing Label Client fixture...');
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error('Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.');
    }
    const client = new LabelClient(request, authStrategy);
    await use(client);
  },
  scenarioState: async ({}, use) => {
    const state: ScenarioState = {
      generated: {},
      createdOrganizationIds: [],
      user1: {
        member: undefined,
        board: undefined,
        list: undefined,
        card: undefined,
      },
      user2: {
        member: undefined,
        board: undefined,
        list: undefined,
        card: undefined,
      },
    };
    await use(state);
  },
  user1: async ({ request }, use) => {
    logger.info('Initializing clients for user1...');
    const apiKey = process.env.TRELLO_API_KEY!;
    const apiToken = process.env.TRELLO_API_TOKEN!;
    await use(buildClientsForUser(request, apiKey, apiToken));
  },
  user2: async ({ request }, use) => {
    logger.info('Initializing clients for user2...');
    const apiKey = process.env.TRELLO_USER2_API_KEY!;
    const apiToken = process.env.TRELLO_USER2_API_TOKEN!;
    await use(buildClientsForUser(request, apiKey, apiToken));
  },
});
