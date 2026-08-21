Feature: Trello Lists

  Scenario: Create, fetch, update, and archive a list
    Given I create a new board named "Board for List Test"
    When I create a list named "Backlog" in the board
    And I fetch the list details
    Then the list name should be "Backlog"
    When I update the list name to "In Progress"
    Then the list name should be "In Progress"
    And I archive the list
    And I clean up by deleting the board