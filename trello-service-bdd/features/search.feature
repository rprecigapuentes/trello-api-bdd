Feature: Trello Search 

    @SCRUM-T37 
    @cleanup-board
    @bug
    Scenario: Get search results for a valid query
        Given a member with a valid ID exists
        #And the member has at least one organization named "SCRUM-T37"
        And the member has at least one card named "SCRUM-T37" in a list of a board
        When the user sends a GET request to /search?query="SCRUM-T37"
        Then the response status code is "200"
        And the response contains only "SCRUM-T37" in the "boards" array
        And the response contains only "SCRUM-T37" in the "cards" array
        #And the response contains only "SCRUM-T37" in the "organizations" array
