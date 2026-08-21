import { createBdd } from "playwright-bdd";
import { test } from "./fixtures";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd(test);

Given(
  "I create a new board named {string}",
  async ({ trelloApi, scenarioState }, name: string) => {
    scenarioState.board = await trelloApi.createBoard(name);
    expect(scenarioState.board.id).toBeTruthy();
  },
);

When("I fetch the board details", async ({ trelloApi, scenarioState }) => {
  if (!scenarioState.board?.id) throw new Error("No active board found");
  scenarioState.board = await trelloApi.getBoard(scenarioState.board.id);
});

Then(
  "the board name should be {string}",
  async ({ scenarioState }, expectedName: string) => {
    expect(scenarioState.board?.name).toBe(expectedName);
  },
);

When(
  "I update the board name to {string}",
  async ({ trelloApi, scenarioState }, newName: string) => {
    if (!scenarioState.board?.id) throw new Error("No active board found");
    scenarioState.board = await trelloApi.updateBoard(scenarioState.board.id, {
      name: newName,
    });
  },
);

Then(
  "I clean up by deleting the board",
  async ({ trelloApi, scenarioState }) => {
    if (scenarioState.board?.id) {
      await trelloApi.deleteBoard(scenarioState.board.id);
      scenarioState.board = undefined;
    }
  },
);
