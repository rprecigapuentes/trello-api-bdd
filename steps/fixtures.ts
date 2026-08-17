import { test as base } from "playwright-bdd";
import { TrelloApiClient } from "./api/trelloClient";
import { TrelloBoard, TrelloList, TrelloCard } from "./api/trelloSchemas";

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
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
      throw new Error(
        "Missing TRELLO_API_KEY or TRELLO_API_TOKEN in environment variables.",
      );
    }
    const client = new TrelloApiClient(request);
    await use(client);
  },
  scenarioState: async ({}, use) => {
    await use({});
  },
});
