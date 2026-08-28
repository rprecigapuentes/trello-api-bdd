@notifications @automated
Feature: Trello Notification Management API

  @skip @SCRUM-T50
  Scenario: TC-NOTIF-01 - Verify updating a notification read status returns 200 OK
    Given the user retrieves an existing notification ID
    When the user updates the unread status to "false"
    Then the response status code should be "200"

  @SCRUM-T51
  Scenario: TC-NOTIF-02 - Verify marking all notifications as read returns 200 OK
    Given a valid user session is active
    When the user sends a request to mark all notifications as read
    Then the response status code should be "200"