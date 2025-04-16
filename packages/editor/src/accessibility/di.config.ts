import {
  accessibilityModule,
  bindAsService,
  type BindingContext,
  configureActionHandler,
  configureElementNavigationTool,
  DeselectKeyTool,
  EnableKeyboardGridAction,
  FeatureModule,
  FocusDomAction,
  HideToastAction,
  KeyboardGrid,
  KeyboardGridCellSelectedAction,
  KeyboardGridKeyboardEventAction,
  ResizeElementAction,
  ShowToastMessageAction,
  TYPES,
  updateMessages
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { FocusDomActionHandler } from './focus-dom-handler';
import { IvyGlobalKeyListenerTool } from './key-listener/global-keylistener-tool';
import { JumpOutKeyListener } from './key-listener/jump-out';
import { QuickActionKeyListener } from './key-listener/quick-actions';
import { IvyResizeElementHandler } from './resize-key-tool/resize-key-handler';
import { IvySearchAutocompletePalette } from './search/search-palette';
import { IvySearchAutocompletePaletteTool } from './search/search-tool';
import { IvyToast } from './toast/toast-tool';
import { IvyMovementKeyTool } from './view-key-tool/movement-key-tool';
import { IvyZoomKeyTool } from './view-key-tool/zoom-key-tool';
import './key-shortcut/accessible-key-shortcut.css';

export const ivyAccessibilityModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureResizeTools(context); // keep
    configureViewKeyTools(context);
    // configureMoveZoom(context);
    configureSearchPaletteModule(context);
    // configureShortcutHelpTool(context);
    configureKeyboardControlTools(context);
    configureElementNavigationTool(context);
    configureToastTool(context);
    configureActionHandler(context, FocusDomAction.KIND, FocusDomActionHandler);
    configureIvyKeyListeners(context);
  },
  {
    featureId: accessibilityModule.featureId
  }
);

updateMessages({
  resize: {
    resize_mode_activated: t('a11y.resize.on'),
    resize_mode_deactivated: t('a11y.resize.off'),
    shortcut_activate: t('a11y.hotkeyDesc.resizeActivate'),
    shortcut_deactivate: t('a11y.hotkeyDesc.resizeDeactivate'),
    shortcut_increase: t('a11y.hotkeyDesc.resizeIncrease'),
    shortcut_decrease: t('a11y.hotkeyDesc.resizeDecrease'),
    shortcut_reset: t('a11y.hotkeyDesc.resizeDefault')
  },
  shortcut: {
    group_resize: t('a11y.hotkeyGroup.resize')
  }
});
updateMessages({
  navigation: {
    default_navigation_mode_activated: t('a11y.navigation.on'),
    default_navigation_mode_deactivated: t('a11y.navigation.off'),
    local_navigation_mode_activated: t('a11y.navigation.onPosition'),
    local_navigation_mode_deactivated: t('a11y.navigation.offPosition'),
    shortcut_local_mode: t('a11y.hotkeyDesc.navigationActivatePosition'),
    shortcut_global_mode: t('a11y.hotkeyDesc.navigationActivate')
  },
  shortcut: {
    group_navigation: t('a11y.hotkeyGroup.navigation')
  }
});
updateMessages({
  shortcut: {
    header_command: t('a11y.ui.command'),
    header_shortcut: t('a11y.ui.keybinding'),
    title: t('a11y.ui.title'),
    menu_title: t('a11y.ui.menuTitle') // TODO: Shortcut Menu
  }
});
updateMessages({
  shortcut: {
    group_move: t('a11y.hotkeyGroup.move'),
    group_zoom: t('a11y.hotkeyGroup.viewport')
  },
  viewport: {
    shortcut_move_viewport: t('a11y.hotkeyDesc.move'),
    shortcut_zoom_viewport: t('a11y.hotkeyDesc.zoom')
  }
});

export const ivyKeyListenerModule = new FeatureModule((bind, unbind, isBound, rebind) => {
  const context = { bind, unbind, isBound, rebind };
  configureIvyKeyListeners(context);
});

function configureResizeTools(context: BindingContext) {
  context.bind(IvyResizeElementHandler).toSelf().inSingletonScope();
  configureActionHandler(context, ResizeElementAction.KIND, IvyResizeElementHandler);
}

function configureViewKeyTools(context: BindingContext) {
  bindAsService(context, TYPES.IDefaultTool, IvyMovementKeyTool);
  bindAsService(context, TYPES.IDefaultTool, IvyZoomKeyTool);
  configureActionHandler(context, KeyboardGridCellSelectedAction.KIND, IvyZoomKeyTool);
  configureActionHandler(context, KeyboardGridKeyboardEventAction.KIND, IvyZoomKeyTool);
  bindAsService(context, TYPES.IDefaultTool, DeselectKeyTool);
}

function configureKeyboardControlTools(context: BindingContext) {
  bindAsService(context, TYPES.IDefaultTool, IvyGlobalKeyListenerTool);
  bindAsService(context, TYPES.IUIExtension, KeyboardGrid);
  configureActionHandler(context, EnableKeyboardGridAction.KIND, KeyboardGrid);
}

function configureIvyKeyListeners({ bind }: BindingContext) {
  bind(TYPES.KeyListener).to(QuickActionKeyListener);
  bind(TYPES.KeyListener).to(JumpOutKeyListener);
}

function configureSearchPaletteModule(context: BindingContext) {
  bindAsService(context, TYPES.IUIExtension, IvySearchAutocompletePalette);
  bindAsService(context, TYPES.IDefaultTool, IvySearchAutocompletePaletteTool);
}

export function configureToastTool(context: BindingContext): void {
  configureActionHandler(context, ShowToastMessageAction.KIND, IvyToast);
  configureActionHandler(context, HideToastAction.KIND, IvyToast);
}
