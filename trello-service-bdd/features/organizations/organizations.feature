@organizations
Feature: Trello organizations

    Background:
        Given an authenticated Trello API client

    @smoke @cleanup-organization @SCRUM-T55
    Scenario: Create an organization with the required displayName only
        When the user creates an organization with a generated displayName
        Then the response status code is "200"
        And the response contains a non-empty organization id
        And the response contains the organization with the submitted "displayName"        

    @regression @cleanup-organization @SCRUM-T56
    Scenario: Create an organization with displayName, name, desc and website
        When the user creates an organization with a generated displayName, a generated name, desc "Created by the SCRUM-T56 automated test", and website "https://developer.atlassian.com/"
        Then the response status code is "200"
        And the response contains a non-empty organization id
        And the response contains the organization with the submitted "displayName"
        And the response contains the organization with the submitted "name"
        And the response contains the organization with the submitted "desc"
        And the response contains the organization with the submitted "website"

    @regression @cleanup-organization @SCRUM-T57
    Scenario: Update an organization sending no parameters
        Given an organization exists
        When the user updates the organization sending no parameters
        Then the response status code is "200"
        And the response contains a non-empty organization id
        And the response contains the organization with every field unchanged

    @smoke @cleanup-organization @SCRUM-T58
    Scenario: Update an organization with displayName, name, desc and website
        Given an organization exists
        When the user updates the organization with a generated displayName, a generated name, desc "Updated by the SCRUM-T58 automated test" and website "https://example.org"
        Then the response status code is "200"
        And the response contains the organization with the submitted "displayName"
        And the response contains the organization with the submitted "name"
        And the response contains the organization with the submitted "desc"
        And the response contains the organization with the submitted "website"

    @smoke @SCRUM-T59
    Scenario: Delete an organization
        Given an organization exists
        When the user deletes the organization
        Then the response status code is "200"
        And a request for the deleted organization returns status 404

    @regression @fail @cleanup-organization @SCRUM-T60
    Scenario: Update an organization logo sending no parameters
        Given an organization exists with a logo already set
        When the user updates the organization logo sending no parameters
        Then the response status code is "200"
        And the response contains the organization with the same logoHash

    @smoke @cleanup-organization @SCRUM-T61
    Scenario: Update an organization logo with an uploaded file
        Given an organization exists
        When the user updates the organization logo with the file "jalasoft_logo.jpg"
        Then the response status code is "200"
        And the response contains the organization with a non-empty logoHash

    @regression @cleanup-organization @SCRUM-T62
    Scenario: Delete an organization logo
        Given an organization exists with a logo already set
        When the user deletes the organization logo
        Then the response status code is "200"
        And the organization has no logoHash

    @regression @SCRUM-T67
    Scenario: Create an organization omitting the required displayName
        When the user creates an organization omitting displayName
        Then the response status code is "400"
        And the response body contains "Display Name must be at least 1 character"

    @regression @SCRUM-T68
    Scenario: Update an organization with a non-existent id
        When the user updates the organization with id "000000000000000000000000" with a generated displayName
        Then the response status code is "404"
        And the response body reports that the requested resource was not found

    @regression @SCRUM-T69
    Scenario: Delete an organization with a non-existent id
        When the user deletes the organization with id "000000000000000000000000"
        Then the response status code is "404"
        And the response body reports that the requested resource was not found