import { GModelRoot, TYPES } from '@eclipse-glsp/client';
import { Container } from 'inversify';
import { assertQuickAction, assertQuickActionUi, createContainer, createRoot } from '../../test-utils/quick-action-ui.test-util';
import { QuickActionUI } from './quick-action-ui';
import ivyQuickActionModule, { configureQuickActionProviders } from './di.config';
import { describe, test, beforeAll } from 'vitest';
import { IvyViewerOptions } from '../../options';

class QuickActionUIReadonly extends QuickActionUI {
  protected isReadonly(): boolean {
    return true;
  }
}

function createContainerReadonly(options?: Partial<IvyViewerOptions>): Container {
  const container = createContainer(options);
  container.unload(ivyQuickActionModule);
  container.bind(QuickActionUIReadonly).toSelf().inSingletonScope();
  container.bind(TYPES.IUIExtension).toService(QuickActionUIReadonly);
  configureQuickActionProviders(container);
  return container;
}

describe('QuickActionUi - Readonly', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createContainerReadonly();
    quickActionUi = container.get<QuickActionUI>(QuickActionUIReadonly);
    root = createRoot(container);
  });

  test('activity', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });

  test('embedded activity', () => {
    quickActionUi.show(root, 'sub');
    assertQuickActionUi(2, { x: 400, y: 150 });
    assertQuickAction(0, 'Information (I)');
    assertQuickAction(1, 'Jump (J)');
  });

  test('edge', () => {
    quickActionUi.show(root, 'edge');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });
});

describe('QuickActionUi - Readonly (hide sensitive infos)', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createContainerReadonly({ hideSensitiveInfo: true });
    quickActionUi = container.get<QuickActionUI>(QuickActionUIReadonly);
    root = createRoot(container);
  });

  test('activity', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });

  test('edge', () => {
    quickActionUi.show(root, 'edge');
    assertQuickActionUi(0);
  });
});
