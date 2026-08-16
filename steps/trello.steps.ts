import { createBdd } from "playwright-bdd";
import { test } from "./fixtures";
import { expect } from "@playwright/test";

const { Given, Then } = createBdd(test);

Given("I fetch board details from Trello API", async ({ request }) => {
  const apiKey = process.env.TRELLO_API_KEY;
  const apiToken = process.env.TRELLO_API_TOKEN;
  const boardId = process.env.TRELLO_BOARD_ID;

  const response = await request.get(
    `https://api.trello.com/1/boards/${boardId}`,
    {
      params: {
        key: apiKey,
        token: apiToken,
      },
    },
  );

  expect(response.status()).toBe(200);
});
