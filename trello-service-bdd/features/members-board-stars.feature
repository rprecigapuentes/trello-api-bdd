Feature: Members Board Stars CRUD

    @SCRUM-T10 @cleanup-board 
    Scenario: Create a board star for a member by a valid member ID and board ID
        Given a member with a valid ID exists
        And the member has a board named "SCRUM-T10"
        When the user sends a POST request to /members/{memberId}/boardStars with the board ID and "<position>" as pos field value
        Then the response status code is "200"
        And the response contains a valid board star schema
        And the response contains the correct board ID and "<position>" field value
        And the GET response contains the "created" board star with the correct values
    
        Examples:
        | position  | 
        | top       |
        | bottom    |
        | 10000     |
        | 1000.1    |

    @SCRUM-T12 @cleanup-board 
    Scenario: Get a board star for a member by a valid member ID and board star ID
        Given a member with a valid ID exists
        And the member has a board star with the "top" position in a board named "SCRUM-T12"
        When the user sends a GET request to /members/{memberId}/boardStars/{boardStarId}
        Then the response status code is "200"
        And the response contains a valid board star schema
        And the response contains the correct board ID and "top" field value

    @SCRUM-T16 @cleanup-board 
    Scenario: Update a board star for a member by a valid member ID and board star ID
        Given a member with a valid ID exists
        And the member has a board star with the "10" position in a board named "SCRUM-T16"
        When the user sends a PUT request to /members/{memberId}/boardStars/{boardStarId} with the board ID and "<position>" as pos field value
        Then the response status code is "200"
        And the response contains a valid board star schema
        And the response contains the correct board ID and "<position>" field value
        And the GET response contains the "updated" board star with the correct values
    
        Examples:
        | position  |
        | top       |
        | bottom    |
        | 10000     |
        | 1000.1    |

    @SCRUM-T26 @cleanup-board 
    Scenario: Delete a board star for a member by a valid member ID and board star ID
        Given a member with a valid ID exists
        And the member has a board star with the "top" position in a board named "SCRUM-T26"
        When the user sends a DELETE request to /members/{memberId}/boardStars/{boardStarId}
        Then the response status code is "200"
        And the GET board star by id response returns a "404" status code