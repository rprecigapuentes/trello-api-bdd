
@cleanup-custom-background
Feature: Custom Board Backgrounds

  Background:
    Given an authenticated Trello API client

  @SCRUM-T20
  Scenario: Upload custom board background via multipart/form-data
    When the user uploads a custom board background with file "test-bg.png"
    Then the response status code is "200"
    And the response contains a custom background object with a non-empty id
    When the user retrieves the custom board backgrounds
    Then the response includes the newly created custom background ID

  @SCRUM-T21
  Scenario: Update custom board background properties
    Given an existing custom board background with file "test-bg.png"
    When the user updates the custom board background with parameter "tile" set to "false"
    Then the response status code is "200"
    When the user retrieves the custom background
    Then the custom background contains "tile" equal to false

  @SCRUM-T22
  Scenario: Delete custom board background
    Given an existing custom board background with file "test-bg.png"
    When the user deletes the custom board background
    Then the response status code is "200"
    When the user attempts to retrieve the deleted custom background
    Then the response status code is "404"
