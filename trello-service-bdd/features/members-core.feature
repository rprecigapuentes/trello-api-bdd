Feature: Members Core

    Scenario: Get a member by ID
        Given a member with a valid ID exists
        When the user sends a GET request to /members/{memberId}
        Then the response status code is 200
        And the response contains a valid member schema
        And the response contains the requested member data