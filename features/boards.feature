Feature: Trello Boards

  Scenario: Create, fetch, update, and delete a board
    Given I create a new board named "BDD Integration Board"
    When I fetch the board details
    Then the board name should be "BDD Integration Board"
    When I update the board name to "Updated BDD Board"
    Then the board name should be "Updated BDD Board"
    And I clean up by deleting the board