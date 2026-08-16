import { createBdd } from "playwright-bdd";
import { test } from "./fixtures";
import { expect } from "@playwright/test";

const { When, Then } = createBdd(test);

When(
  "I create a list named {string} in the board",
  async ({ trelloApi, scenarioState }, listName: string) => {
    if (!scenarioState.board?.id)
      throw new Error("No board found in scenario state");
    scenarioState.list = await trelloApi.createList(
      scenarioState.board.id,
      listName,
    );
    expect(scenarioState.list.id).toBeTruthy();
  },
);

When("I fetch the list details", async ({ trelloApi, scenarioState }) => {
  if (!scenarioState.list?.id) throw new Error("No active list found");
  scenarioState.list = await trelloApi.getList(scenarioState.list.id);
});

Then(
  "the list name should be {string}",
  async ({ scenarioState }, expectedName: string) => {
    expect(scenarioState.list?.name).toBe(expectedName);
  },
);

When(
  "I update the list name to {string}",
  async ({ trelloApi, scenarioState }, newName: string) => {
    if (!scenarioState.list?.id) throw new Error("No active list found");
    scenarioState.list = await trelloApi.updateList(scenarioState.list.id, {
      name: newName,
    });
  },
);

Then("I archive the list", async ({ trelloApi, scenarioState }) => {
  if (!scenarioState.list?.id) throw new Error("No active list found");
  const updated = await trelloApi.archiveList(scenarioState.list.id);
  expect(updated.closed).toBe(true);
});
