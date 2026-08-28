@cleanup-board
Feature: Members Resources

    @SCRUM-T28 
    Scenario: Get boards that a member belongs to by a valid ID
        Given a member with a valid ID exists
        And the member has at least one board named "SCRUM-T28"
        When the user sends a GET request to /members/{memberId}/"boards"
        Then the response status code is "200"
        And the response contains a valid array of boards
        And the response contains the board named "SCRUM-T28" in the array of boards

    @SCRUM-T29 @runLast
    Scenario: Get empty board's list that a member belongs to by a valid ID
        Given a member with a valid ID exists
        And the member has no boards
        When the user sends a GET request to /members/{memberId}/"boards"
        Then the response status code is "200"
        And the response contains a valid array of boards
        And the response contains an empty array of boards

    @SCRUM-T30
    Scenario: Get member's assigned cards by a valid ID
        Given a member with a valid ID exists
        And the member has at least one card named "SCRUM-T30" in a list of a board
        And the member is assigned to the card
        When the user sends a GET request to /members/{memberId}/"cards"
        Then the response status code is "200"
        And the response contains a valid array of cards 
        And the response contains the card named "SCRUM-T30" in the array of cards