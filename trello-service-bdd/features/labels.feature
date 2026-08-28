@labels
Feature: Trello labels

    Background:
        Given an authenticated Trello API client
        And a board exists

    @smoke @cleanup-board @SCRUM-T63
    Scenario: Create a label with name, color and idBoard
        When the user creates a label on that board with a generated name and color "green"
        Then the response status code is "200"
        And the response contains a label with the generated name and color "green"
        And the response contains a label bound to that board

    @regression @cleanup-board @SCRUM-T64
    Scenario: Update a label sending no parameters
        Given a label exists on that board
        When the user updates the label sending no parameters
        Then the response status code is "200"
        And the response contains the label with every field unchanged

    @smoke @cleanup-board @SCRUM-T65
    Scenario: Update a label with name and color
        Given a label exists on that board
        When the user updates the label with a generated name and color "blue"
        Then the response status code is "200"
        And the response contains a label with the generated name and color "blue"

    @smoke @cleanup-board @SCRUM-T66
    Scenario: Delete a label
        Given a label exists on that board
        When the user deletes the label
        Then the response status code is "200"
        And a request for the deleted label returns status 404

    @regression @fail @cleanup-board @SCRUM-T70
    Scenario: Create a label omitting the required color
        When the user creates a label on that board with a generated name omitting color
        Then the response status code is "400"
        And the response body contains "invalid value for color"

    @regression @cleanup-board @SCRUM-T71
    Scenario: Create a label with a color outside the accepted set
        When the user creates a label on that board with a generated name and color "octarine"
        Then the response status code is "400"
        And the response body contains "invalid value for color"

    @regression @cleanup-board @SCRUM-T72
    Scenario: Create a label with a non-existent idBoard
        When the user creates a label on the board with id "000000000000000000000000" with a generated name and color "green"
        Then the response status code is "404"
        And the response body reports that the "board" was not found

    @regression @cleanup-board @SCRUM-T73
    Scenario: Update a label with a non-existent id
        When the user updates the label with id "000000000000000000000000" with a generated name
        Then the response status code is "404"
        And the response body reports that the requested resource was not found