import { test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Part states', () => {
  test('different states on different parts', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const casePart = inscriptionView.inscriptionTab('Case');
    const dialogPart = inscriptionView.inscriptionTab('Dialog');

    await casePart.expectState('configured');
    await dialogPart.expectState('warning');

    await casePart.open();
    await casePart.macroInput('Name').clear();
    await casePart.expectState('error');
    await dialogPart.expectState('warning');

    await dialogPart.open();
    await dialogPart.section('Dialog').open();
    await dialogPart.combobox().choose('AcceptRequest');
    await casePart.expectState('error');
    await dialogPart.expectState('configured');
  });
});
