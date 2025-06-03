import { test } from '@playwright/test';
import { screenshotInscriptionTab } from './screenshot-util';

const PROCESS_PID = '167C6BD0817F2889' as const;

test.describe('Web Service Process', () => {
  test('Web Service Process', async ({ page }) => {
    await screenshotInscriptionTab(page, PROCESS_PID, 'Web Service Process', 'ws-process-tab-ws-process.png');
  });
});
