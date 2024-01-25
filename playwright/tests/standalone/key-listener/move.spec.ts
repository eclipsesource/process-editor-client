import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/process-editor';
import { cmdCtrl } from '../../page-objects/test-helper';

test.describe('move with arrow keys', () => {
  test('elements', async ({ page, browserName }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const start = processEditor.element('start:requestStart');
    const end = processEditor.element('end:taskEnd');
    const startPos = await start.getPosition();
    const endPos = await end.getPosition();

    await processEditor.multiSelect([start, end], cmdCtrl(browserName));
    await page.keyboard.press('ArrowUp');
    await start.expectPosition({ x: startPos.x, y: startPos.y - 8 });
    await end.expectPosition({ x: endPos.x, y: endPos.y - 8 });

    await page.keyboard.press('ArrowLeft');
    await start.expectPosition({ x: startPos.x - 8, y: startPos.y - 8 });
    await end.expectPosition({ x: endPos.x - 8, y: endPos.y - 8 });

    await page.keyboard.press('ArrowDown');
    await start.expectPosition({ x: startPos.x - 8, y: startPos.y });
    await end.expectPosition({ x: endPos.x - 8, y: endPos.y });

    await page.keyboard.press('ArrowRight');
    await start.expectPosition(startPos);
    await end.expectPosition(endPos);
  });

  test('pool and lane', async ({ page, browserName }) => {
    const processEditor = await ProcessEditor.openProcess(page);
    const pool = await processEditor.createPool({ x: 10, y: 60 });
    const lane = await pool.createEmbeddedLane();
    const start = processEditor.element('start:requestStart');
    await pool.select();
    await processEditor.resetSelection();
    const startPos = await start.getPosition();
    const poolPos = await pool.getPosition();
    const lanePos = await lane.getPosition();

    await processEditor.multiSelect([pool, lane], cmdCtrl(browserName), { x: 10, y: 10 });
    await page.keyboard.press('ArrowDown');
    await start.expectPosition(startPos);
    await pool.expectPosition({ x: poolPos.x, y: poolPos.y + 8 });
    await lane.expectPosition(lanePos);

    await page.keyboard.press('ArrowUp');
    await start.expectPosition(startPos);
    await pool.expectPosition(poolPos);
    await lane.expectPosition(lanePos);

    await processEditor.resetSelection();
    await lane.select();
    await page.keyboard.press('ArrowDown');
    await start.expectPosition(startPos);
    await pool.expectPosition(poolPos);
    await lane.expectPosition({ x: lanePos.x, y: lanePos.y + 8 });
  });
});