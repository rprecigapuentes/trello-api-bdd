@lists @automated  @cleanup-board
Feature: Trello List Management API

  Background:
    Given a temporary board exists

  @SCRUM-T40
  Scenario: TC-LIST-01 - Verify creating a new list
    When the user creates a list named "BDD Automated List" in the board
    Then the response status code should be "200"
    And the list name should match the created name
    And the list closed status should be "false"

  @SCRUM-T41
  Scenario: TC-LIST-02 - Verify updating list details
    Given the user creates a list named "BDD Automated List" in the board
    When the user updates the list name to "Updated BDD List"
    Then the response status code should be "200"
    And the list name should be "Updated BDD List"

  @SCRUM-T42
  Scenario: TC-LIST-03 - Verify archiving and unarchiving a list
    Given the user creates a list named "BDD Automated List" in the board
    When the user archives the list
    Then the response status code should be "200"
    And the list closed status should be "true"
    When the user unarchives the list
    Then the response status code should be "200"
    And the list closed status should be "false"

@SCRUM-T43
  Scenario: TC-LIST-04 - Verify archiving all cards in a list
    Given a temporary board exists
    And a list named "BDD Automated List" exists in the active board
    And a card named "Card to Archive" exists in the active list
    When the user archives all cards in the active list
    Then the response status code should be "200"
    And the active list should contain 0 open cards

  @SCRUM-T44
  Scenario: TC-LIST-05 - Verify moving all cards to another list
    Given a temporary board exists
    And a list named "Source List" exists in the active board
    And a target list named "Destination List" exists in the active board
    And a card named "Card to Move" exists in the active list
    When the user moves all cards from the active list to destination list
    Then the response status code should be "200"
    And the destination list should contain the created card
    And the active list should contain 0 open cards

  @SCRUM-T45
  Scenario: TC-LIST-06 - Verify reassigning a list to a board
    Given the user creates a list named "BDD Automated List" in the board
    When the user moves the list to the active test board
    Then the response status code should be "200"
    And the list board ID should match the active board ID

  @SCRUM-T46
  Scenario: TC-LIST-07 - Verify updating a specific field on a list
    Given the user creates a list named "BDD Automated List" in the board
    When the user updates the list field "name" with value "Field Specific Update"
    Then the response status code should be "200"
    And the list name should be "Field Specific Update"