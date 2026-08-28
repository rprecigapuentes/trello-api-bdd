Feature: Trello Boards

  Scenario: Create, fetch, update, and delete a board
    Given I create a new board named "BDD Integration Board"
    When I fetch the board details
    Then the board name should be "BDD Integration Board"
    When I update the board name to "Updated BDD Board"
    Then the board name should be "Updated BDD Board"
    And I clean up by deleting the board

  @cleanup-board @e2e @SCRUM-T75
  Scenario: Create, search, delete and verify deletion of a board
    Given a member with a valid ID exists
    And the member has a board named "SCRUM-T75"
    When the user sends a GET request to /search?query="SCRUM-T75"
    Then the response status code is "200"
    And the response contains only "SCRUM-T75" "name" in the "boards" array
    When the user sends a DELETE request to /boards/{boardId}
    And the user sends a GET request to /search?query="SCRUM-T75"
    Then the response status code is "200"
    And the response contains an empty "boards" array
