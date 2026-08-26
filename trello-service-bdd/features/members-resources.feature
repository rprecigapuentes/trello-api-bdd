Feature: Members Resources

    @cleanup-board
    Scenario: Get boards that a member belongs to by a valid ID
        Given a member with a valid ID exists
        And the member has at least one board named "SCRUM-T28"
        When the user sends a GET request to /members/{memberId}/boards
        Then the response status code is "200"
        And the response contains a valid array of boards schema
        And the response contains the board named "SCRUM-T28" in the array of boards