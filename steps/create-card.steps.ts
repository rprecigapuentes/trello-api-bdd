import { createBdd } from "playwright-bdd";
import { test } from "./fixtures";
import { expect } from "@playwright/test";
import { TrelloBoard, TrelloList, TrelloCard } from "./api/trelloTypes";

const { Given, When, Then } = createBdd(test);

let board: TrelloBoard;
let list: TrelloList;
let card: TrelloCard;

const testCardName = "Automated Card";
const testCardDesc = "Created via Playwright BDD";

Given("I have created a new board", async ({ trelloApi }) => {
  board = await trelloApi.createBoard("BDD Test Board");
  expect(board.id).toBeTruthy();
});

Given("I have created a list in the board", async ({ trelloApi }) => {
  list = await trelloApi.createList(board.id, "To Do");
  expect(list.id).toBeTruthy();
});

When("I create a card in the list", async ({ trelloApi }) => {
  card = await trelloApi.createCard(list.id, testCardName, testCardDesc);
  expect(card.id).toBeTruthy();
});

Then("the card should be created successfully", async () => {
  expect(card).toBeDefined();
  expect(card.id).toBeDefined();
});

Then(
  "the card should have the correct name and description",
  async ({ trelloApi }) => {
    expect(card.name).toBe(testCardName);
    expect(card.desc).toBe(testCardDesc);

    if (board?.id) {
      await trelloApi.deleteBoard(board.id);
    }
  },
);
