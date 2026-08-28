
@cleanup-background
Feature: Standard Board Backgrounds

  Background:
    Given an authenticated Trello API client

  @SCRUM-T17
  Scenario: Upload standard board background via multipart/form-data
    When the user uploads a standard board background with file "test-bg.png"
    Then the response status code is "200"
    And the response contains a background object with a non-empty id
    When the user retrieves the board backgrounds
    Then the response includes the newly created background ID

  @SCRUM-T18
  Scenario: Update standard board background properties
    Given an existing standard board background with file "test-bg.png"
    When the user updates the board background with parameter "brightness" set to "light"
    Then the response status code is "200"
    When the user retrieves the background
    Then the response contains "brightness" equal to "light"

  @SCRUM-T19
  Scenario: Delete standard board background
    Given an existing standard board background with file "test-bg.png"
    When the user deletes the board background
    Then the response status code is "200"
    When the user attempts to retrieve the deleted background
    Then the response status code is "404"
