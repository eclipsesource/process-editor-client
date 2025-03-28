import type { BoundsAware, Selectable, GModelElement } from '@eclipse-glsp/client';
import { isBoundsAware, isSelectable, GParentElement } from '@eclipse-glsp/client';

export const quickActionFeature = Symbol('quickActionFeature');

export interface QuickActionAware extends BoundsAware, Selectable {}

export function isQuickActionAware(element: GModelElement): element is GParentElement & QuickActionAware {
  return isBoundsAware(element) && isSelectable(element) && element instanceof GParentElement && element.hasFeature(quickActionFeature);
}
