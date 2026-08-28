Feature: Custom Emojis

  Background:
    Given an authenticated Trello API client

  @SCRUM-T23
  Scenario: Create custom emoji via image upload
    When the user creates a custom emoji with file "test-bg.png" and name "custom_smile"
    Then the response status code is "200"
    And the response contains a non-empty emoji id
    When the user retrieves the custom emojis
    Then the response contains an emoji with the created name
