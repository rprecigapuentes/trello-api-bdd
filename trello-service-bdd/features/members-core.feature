Feature: Members Core

    Scenario: Get a member by a valid ID
        Given a member with a valid ID exists
        When the user sends a GET request to /members/{memberId}
        Then the response status code is "200"
        And the response contains a valid member schema
        And the response contains the requested member data

    Scenario: Get a member field value by a valid ID and field name
        Given a member with a valid ID exists
        And "<field>" is a valid field of the member model
        When the user sends a GET request to /members/{memberId}/<field>
        Then the response status code is "200"
        And the response contains the "_value" property
        And the response contains the correct "<field>" value under "_value" property

        Examples:
        | field    | 
        | username | 
        | fullName | 
        | bio      | 

    Scenario: Get an error response by a valid ID and an invalid field name
        Given a member with a valid ID exists
        And "<nonExistentField>" is an invalid field of the member model
        When the user sends a GET request to /members/{memberId}/<nonExistentField>
        Then the response status code is "404"
        And the response contains an error message indicating the "<nonExistentField>" field does not exist
        

        Examples:
        | nonExistentField    | 
        | invalidField        |
        | usernames           |
        | e-mail              |

    @cleanup-board
    Scenario: Get boards that a member belongs to by a valid ID
        Given a member with a valid ID exists
        And the member has at least one board named "SCRUM-T28"
        When the user sends a GET request to /members/{memberId}/boards
        Then the response status code is "200"
        And the response contains a valid array of boards schema
        And the response contains the board named "SCRUM-T28" in the array of boards