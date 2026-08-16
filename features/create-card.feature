Feature: Trello cards

    Scenario: Successfully create a card
        Given I have created a new board 
        And I have created a list in the board
        When I create a card in the list
        Then the card should be created successfully
        And the card should have the correct name and description