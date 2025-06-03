import { test } from '@playwright/test';
import { screenshotInscriptionTab } from './screenshot-util';

const SCRIPT_PID = '168F0C6DF682858E-f3' as const;

test.describe('Inscription View', () => {
  test('Example', async ({ page }) => {
    await screenshotInscriptionTab(page, SCRIPT_PID, 'Output', 'example-inscription-view.png', true);
  });
});
