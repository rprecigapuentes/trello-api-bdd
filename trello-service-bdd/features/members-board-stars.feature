Feature: Members Board Stars CRUD

    @SCRUM-T10 @cleanup-board 
    Scenario: Create a board star for a member by a valid member ID and board ID
        Given a member with a valid ID exists
        And the member has a board named "SCRUM-T10"
        When the user sends a POST request to /members/{memberId}/boardStars with the board ID and "<position>" as pos field value
        Then the response status code is "200"
        And the response contains a valid board star schema
        And the response contains the correct board ID and position field value
    
        Examples:
        | position  | 
        | top       |
        | bottom    |
        | 10000     |
        | 1000.1    |
