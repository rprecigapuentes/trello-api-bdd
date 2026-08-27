Feature: Trello Search 

    @SCRUM-T37 
    @cleanup-board
    @bug
    @cleanup-organization
    Scenario: Get search results for a valid query
        Given a member with a valid ID exists
        And the member has at least one organization named "SCRUM-T37"
        And the member has at least one card named "SCRUM-T37" in a list of a board
        When the user sends a GET request to /search?query="SCRUM-T37"
        Then the response status code is "200"
        And the response contains only "SCRUM-T37" "name" in the "boards" array
        And the response contains only "SCRUM-T37" "name" in the "cards" array
        And the response contains only "SCRUM-T37" "displayName" in the "organizations" array

    @SCRUM-T38
    @cleanup-board
    Scenario: Get empty search results for a query with no matches
        Given a member with a valid ID exists
        And the member does not have any "organizations" named "SCRUM-T38"
        And the member does not have any "cards" named "SCRUM-T38"
        And the member does not have any "boards" named "SCRUM-T38"
        When the user sends a GET request to /search?query="SCRUM-T38"
        Then the response status code is "200"
        And the response contains an empty "boards" array
        And the response contains an empty "cards" array
        And the response contains an empty "organizations" array

    @SCRUM-T39
    Scenario: Get search results for a valid member query
        Given a member with a valid ID exists
        When the user sends a GET request to /search?query with the member's username
        Then the response status code is "200"
        And the response contains only the users that match the member's username in the "members" array
        #And the response contains only "SCRUM-T37" "displayName" in the "organizations" array
