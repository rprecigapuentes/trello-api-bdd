import { test as base } from "playwright-bdd";
import { TrelloApiClient } from "./api/trelloClient";
import { TrelloBoard, TrelloList, TrelloCard } from "./api/trelloTypes";

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
    const client = new TrelloApiClient(request);
    await use(client);
  },
  scenarioState: async ({}, use) => {
    await use({});
  },
});
