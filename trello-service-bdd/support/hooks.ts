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
