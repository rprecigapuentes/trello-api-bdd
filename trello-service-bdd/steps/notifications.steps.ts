import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { expect, APIResponse } from '@playwright/test';
import { logger } from '@core';

const { Given, When } = createBdd(test);

Given(
  'the user retrieves an existing notification ID',
  async ({ notificationClient, scenarioState }) => {
    logger.info('Retrieving notifications for the current authenticated user...');
    const response = await notificationClient.getMyNotifications();
    expect(response.status()).toBe(200);

    const notifications = await response.json();

    if (!notifications || notifications.length === 0) {
      throw new Error(
        'No notifications found for the current user. Cannot proceed with single-notification assertions.',
      );
    }

    scenarioState.notificationId = notifications[0].id;
    logger.info(`Found active notification ID: ${scenarioState.notificationId}`);
  },
);

When(
  'the user updates the unread status to {string}',
  async ({ notificationClient, scenarioState }, unreadStr: string) => {
    const notificationId = scenarioState.notificationId as string;
    const unread = unreadStr === 'true';

    logger.info(`Updating notification ${notificationId} unread status to ${unread}...`);

    if (scenarioState.isMockNotification) {
      scenarioState.lastResponse = {
        status: () => 200,
        json: async () => ({ id: notificationId, unread }),
        ok: () => true,
      } as unknown as APIResponse;
    } else {
      const response = await notificationClient.updateNotificationReadStatus(
        notificationId,
        unread,
      );
      scenarioState.lastResponse = response;
    }
  },
);

Given('a valid user session is active', async () => {
  logger.info('Verifying active user session credentials...');
  expect(process.env.TRELLO_API_KEY).toBeDefined();
  expect(process.env.TRELLO_API_TOKEN).toBeDefined();
});

When(
  'the user sends a request to mark all notifications as read',
  async ({ notificationClient, scenarioState }) => {
    logger.info('Sending POST /1/notifications/all/read request...');
    const response = await notificationClient.markAllNotificationsAsRead();
    scenarioState.lastResponse = response;
  },
);
