@organizations @labels
Feature: Trello organization and label lifecycle

    Background:
        Given an authenticated Trello API client

    @regression @cleanup-board @SCRUM-T74
    Scenario: An organization and its label complete the full lifecycle
        When the user creates an organization with a generated displayName
        Then the response status code is "200"
        When the user updates the organization with a generated displayName
        Then the response status code is "200"
        When the user updates the organization logo with the file "jalasoft_logo.jpg"
        Then the response status code is "200"
        When the user creates a board inside that organization
        Then the response status code is "200"
        When the user creates a label on that board with a generated name and color "green"
        Then the response status code is "200"
        When the user updates the label with a generated name and color "blue"
        Then the response status code is "200"
        When the user deletes the label
        Then the response status code is "200"
        When the user deletes the organization logo
        Then the response status code is "200"
        When the user deletes the organization
        Then the response status code is "200"
        And a request for the deleted organization returns status 404