import '../../css/tool-bar.css';

import {
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  GLSP_TYPES
} from '@eclipse-glsp/client';
import { ContainerModule, interfaces } from 'inversify';
import { TYPES } from 'sprotty';
import { IVY_TYPES } from '../types';
import { CenterButtonProvider, FitToScreenButtonProvider, OriginScreenButtonProvider } from './button';

import { ToolBar } from './tool-bar';
import { ToolBarFeedbackCommand } from './tool-bar-feedback';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';

const ivyToolBarModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ToolBar).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(ToolBar);
  configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, ToolBar);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, ToolBar);
  configureCommand({ bind, isBound }, ToolBarFeedbackCommand);
  bind(GLSP_TYPES.ITool).to(IvyMarqueeMouseTool);
  configureToolBarButtonProvider({ bind });
});

export function configureToolBarButtonProvider(context: { bind: interfaces.Bind }): void {
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(CenterButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(OriginScreenButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(FitToScreenButtonProvider);
}

export default ivyToolBarModule;
