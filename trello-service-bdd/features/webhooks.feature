@cleanup-webhook
@cleanup-board
Feature: Webhooks

  Background:
    Given an authenticated Trello API client

  @SCRUM-T11
  Scenario: Create webhook with external callback URL
    Given a board to monitor
    When the user creates a webhook with callback URL "https://example.com/"
    Then the response status code is "200"
    And the response contains a webhook object with active set to true
    When the user retrieves the webhook
    Then the response contains the callback URL "https://example.com/" and active status true

  @SCRUM-T13
  Scenario: Modify webhook properties
    Given an existing webhook
    When the user updates the webhook with description "Updated Webhook" and active set to "false"
    Then the response status code is "200"
    When the user retrieves the webhook
    Then the response contains description "Updated Webhook" and active status false

  @SCRUM-T14
  Scenario: Delete webhook by ID
    Given an existing webhook
    When the user deletes the webhook
    Then the response status code is "200"
    When the user attempts to retrieve the deleted webhook
    Then the response status code is "404"

  @e2e @flaky
  @SCRUM-T15
  Scenario: Full webhook lifecycle execution
    Given a board to monitor
    When the user creates a webhook with a test callback URL
    Then the response status code is "200"
    And the response contains a webhook object with active set to true
    When the user retrieves the webhook
    Then the response contains the correct callback URL and idModel
    When an action is triggered on the monitored board
    Then the callback URL receives a valid JSON payload for the event
    When the user deletes the webhook
    Then the response status code is "200"
    When the user attempts to retrieve the deleted webhook
    Then the response status code is "404"
