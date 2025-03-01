import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../page-objects/inscription/inscription-view';
import { CaseTest } from '../parts/case';
import { EndPageTest } from '../parts/end-page';
import { GeneralTest } from '../parts/name';
import { OutputTest } from '../parts/output';
import { runTest } from '../parts/part-tester';
import { TasksTester } from '../parts/task';

test.describe('Tasks', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('TaskSwitchGateway', { connectTo: ['Script'], additionalElements: ['ErrorStartEvent'] });
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Tasks');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Output', async () => {
    await runTest(view, OutputTest);
  });

  test('Tasks', async () => {
    await runTest(view, new TasksTester(new RegExp(testee.processId)));
  });

  test('Case', async () => {
    await runTest(view, CaseTest);
  });

  test('EndPage', async () => {
    await runTest(view, EndPageTest);
  });
});
