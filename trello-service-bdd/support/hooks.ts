import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';
import { logger, setupLogger } from '@core';

const { Before, After, BeforeAll } = createBdd(test);

BeforeAll(async () => {
  await setupLogger();
});

Before(async ({ $testInfo }) => {
  logger.info(`Starting scenario: ${$testInfo.title}`);
});

After(async ({ $testInfo }) => {
  if ($testInfo.status === 'failed') {
    logger.error(`Scenario failed: ${$testInfo.title}`);
  }
});

After({ tags: '@cleanup-board' }, async ({ scenarioState, boardClient, $testInfo }) => {
  if (scenarioState.board) {
    await boardClient.deleteBoard(scenarioState.board.id);
    logger.info(
      `Deleted board with ID: ${scenarioState.board.id} after scenario: ${$testInfo.title}`,
    );
  }
  console.log(`Cleanup completed: ${$testInfo.title} with tags: ${$testInfo.tags}`);
});

After({ tags: '@cleanup-background' }, async ({ scenarioState, backgroundClient, $testInfo }) => {
  if ($testInfo.status === 'failed') {
    logger.error(`Scenario failed: ${$testInfo.title}`);
  }
  if (scenarioState.background) {
    await backgroundClient.deleteBackground(scenarioState.background.id);
    logger.info(
      `Deleted background with ID: ${scenarioState.background.id} after scenario: ${$testInfo.title}`,
    );
  }
});

After(
  { tags: '@cleanup-custom-background' },
  async ({ scenarioState, customBackgroundClient, $testInfo }) => {
    if ($testInfo.status === 'failed') {
      logger.error(`Scenario failed: ${$testInfo.title}`);
    }
    if (scenarioState.background) {
      await customBackgroundClient.deleteCustomBackground(scenarioState.background.id);
      logger.info(
        `Deleted custom background with ID: ${scenarioState.background.id} after scenario: ${$testInfo.title}`,
      );
    }
  },
);

After({ tags: '@cleanup-organization' }, async ({ scenarioState, organizationClient }) => {
  for (const orgId of [...scenarioState.createdOrganizationIds].reverse()) {
    const response = await organizationClient.deleteOrganization(orgId);
    if (!response.ok()) {
      logger.error(`Failed to delete organization with ID: ${orgId}. Status: ${response.status()}`);
    } else {
      logger.info(`Deleted organization with ID: ${orgId} after scenario.`);
    }
  }
});

After({ tags: '@cleanup-sticker' }, async ({ scenarioState, customStickerClient, $testInfo }) => {
  if ($testInfo.status === 'failed') {
    logger.error(`Scenario failed: ${$testInfo.title}`);
  }
  if (scenarioState.sticker) {
    await customStickerClient.deleteCustomSticker(scenarioState.sticker.id);
    logger.info(
      `Deleted custom sticker with ID: ${scenarioState.sticker.id} after scenario: ${$testInfo.title}`,
    );
  }
});

After({ tags: '@cleanup-webhook' }, async ({ scenarioState, webhookClient, $testInfo }) => {
  if ($testInfo.status === 'failed') {
    logger.error(`Scenario failed: ${$testInfo.title}`);
  }
  if (scenarioState.webhook) {
    await webhookClient.deleteWebhook(scenarioState.webhook.id);
    logger.info(
      `Deleted webhook with ID: ${scenarioState.webhook.id} after scenario: ${$testInfo.title}`,
    );
  }
});
