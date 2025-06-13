import { toast } from '@axonivy/ui-components';
import { HideToastAction, ShowToastMessageAction, type Action, type IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyToast implements IActionHandler {
  private messageToast?: string | number;

  handle(action: Action) {
    if (ShowToastMessageAction.is(action)) {
      toast.dismiss(this.messageToast);
      this.messageToast = toast.info(action.options.message, { duration: action.options.timeout });
    } else if (HideToastAction.is(action)) {
      toast.dismiss(this.messageToast);
    }
  }
}
