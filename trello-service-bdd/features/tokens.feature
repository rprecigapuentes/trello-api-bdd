@tokens @automated
Feature: Trello Token Management API

  @SCRUM-T47
  Scenario: TC-TOK-01 - Verify revoking a token with invalid parameters returns 401 Unauthorized
    Given a dummy API token is configured for testing
    When the user sends a request to revoke the token
    Then the response status code should be "401"

  @SCRUM-T48
  Scenario: TC-TOK-02 - Verify request with revoked token returns 401 Unauthorized
    Given a dummy API token is configured for testing
    And the token is revoked
    When the user requests member details using the revoked token
    Then the response status code should be "401"