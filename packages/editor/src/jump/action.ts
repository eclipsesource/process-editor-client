import { Action, IActionHandler, SModelElement } from '@eclipse-glsp/client';
import { SelectAllAction } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { StreamlineIcons } from '../StreamlineIcons';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isJumpable } from './model';
import { JumpAction } from '@axonivy/process-editor-protocol';

@injectable()
export class JumpActionHandler implements IActionHandler {
  handle(action: Action): Action | void {
    if (JumpAction.is(action)) {
      return SelectAllAction.create(false);
    }
  }
}

@injectable()
export class JumpQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isJumpable(element)) {
      return new JumpQuickAction(element.id);
    }
    return undefined;
  }
}

class JumpQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Jump,
    public readonly title = 'Jump (J)',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'A',
    public readonly action = JumpAction.create({ elementId: elementId }),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyJ'
  ) {}
}