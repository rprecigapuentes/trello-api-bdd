
@cleanup-sticker
Feature: Custom Stickers

  Background:
    Given an authenticated Trello API client

  @SCRUM-T24
  Scenario: Upload custom sticker via multipart/form-data
    When the user uploads a custom sticker with file "test-bg.png"
    Then the response status code is "200"
    And the response contains a non-empty sticker id
    When the user retrieves the custom stickers
    Then the response includes the new sticker ID

  @SCRUM-T25
  Scenario: Delete custom sticker by ID
    Given an existing custom sticker with file "test-bg.png"
    When the user deletes the custom sticker
    Then the response status code is "200"
    When the user attempts to retrieve the deleted sticker
    Then the response status code is "404"
