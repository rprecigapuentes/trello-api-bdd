Feature: Members Core

    Scenario: Get a member by ID
        Given a member with a valid ID exists
        When the user sends a GET request to /members/{memberId}
        Then the response status code is "200"
        And the response contains a valid member schema
        And the response contains the requested member data


    Scenario: 
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