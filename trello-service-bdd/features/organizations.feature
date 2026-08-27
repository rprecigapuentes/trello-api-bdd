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
        When the user creates an organization with a generated displayName, a generated name, desc "AT-SCRUM-T56", and website "https://developer.atlassian.com/"
        Then the response status code is "200"
        And the response contains a non-empty organization id
        And the response contains the organization with the submitted "displayName"
        And the response contains the organization with the submitted "name"
        And the response contains the organization with the submitted "desc"
        And the response contains the organization with the submitted "website"
