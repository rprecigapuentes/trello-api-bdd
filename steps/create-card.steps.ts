import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("I have a valid Trello authentication token", async () => {
  console.log("Executing step: I have a valid Trello authentication token");
});

Given("I have created a new board", async () => {
  console.log("Executing step: I have created a new board");
});

Given("I have created a list in the board", async () => {
  console.log("Executing step: I have created a list in the board");
});

When("I create a card in the list", async () => {
  console.log("Executing step: I create a card in the list");
});

Then("the card should be created successfully", async () => {
  console.log("Executing step: the card should be created successfully");
});

Then("the card should have the correct name and description", async () => {
  console.log(
    "Executing step: the card should have the correct name and description"
  );
});