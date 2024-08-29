import {
  ConsoleLogger,
  ContainerConfiguration,
  DEFAULT_ALIGNABLE_ELEMENT_FILTER,
  DiagramLoader,
  GLSPCenterGridSnapper,
  IHelperLineOptions,
  LogLevel,
  MarqueeUtil,
  ModelViewer,
  TYPES,
  baseViewModule,
  bindOrRebind,
  contextMenuModule,
  gridModule,
  helperLineModule,
  hoverModule,
  initializeDiagramContainer,
  navigationModule,
  overrideViewerOptions,
  statusModule
} from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyAnimateModule from './animate/di.config';
import ivyConnectorModule from './connector/di.config';
import ivyDecorationModule from './decorator/di.config';
import ivyDiagramModule from './diagram/di.config';
import { LaneNode } from './diagram/model';
import { ivyLabelEditModule, ivyLabelEditUiModule } from './edit-label/di.config';
import ivyExecutionModule from './execution/di.config';
import { IvyGLSPCommandStack } from './ivy-command-stack';
import ivyJumpModule from './jump/di.config';
import ivyKeyListenerModule from './key-listener/di.config';
import ivyLaneModule from './lanes/di.config';
import { ivyNotificationModule } from './notification/di.config';
import { IvyViewerOptions, defaultIvyViewerOptions } from './options';
import { ivyChangeBoundsToolModule, ivyExportModule } from './tools/di.config';
import { IVY_TYPES } from './types';
import ivyQuickActionModule from './ui-tools/quick-action/di.config';
import ivyToolBarModule from './ui-tools/tool-bar/di.config';
import ivyViewportModule from './ui-tools/viewport/di.config';
import ivyWrapModule from './wrap/di.config';
import ivyZorderModule from './zorder/di.config';

import '@axonivy/ui-icons/lib/ivy-icons.css';
import 'toastify-js/src/toastify.css';
import './colors.css';
import './toastify.css';
import { IvyMarqueeUtil } from './ui-tools/tool-bar/marquee-behavior';
import { IvyDiagramLoader, IvyModelViewer } from './d-loader';

export default function createContainer(widgetId: string, ...containerConfiguration: ContainerConfiguration): Container {
  const container = initializeDiagramContainer(
    new Container(),
    // removals: not needed defaults
    { remove: [hoverModule, navigationModule, statusModule, contextMenuModule] },

    // GLSP additions: optional modules from GLSP
    baseViewModule,
    helperLineModule,
    gridModule,

    // replacements:
    // ensure that replacements have the same featureId as the original modules to properly handle
    // dependencies/requirements between modules as otherwise some other modules might not be loaded
    { replace: ivyViewportModule },
    { replace: ivyDecorationModule },
    { replace: ivyZorderModule },
    { replace: ivyToolBarModule },
    { replace: ivyLabelEditModule },
    { replace: ivyLabelEditUiModule },
    { replace: ivyChangeBoundsToolModule },
    { replace: ivyExportModule },

    // Ivy additions
    ivyDiagramModule,
    ivyQuickActionModule,
    ivyWrapModule,
    ivyJumpModule,
    ivyLaneModule,
    ivyAnimateModule,
    ivyExecutionModule,
    ivyConnectorModule,
    ivyKeyListenerModule,
    ivyNotificationModule,

    // additional configurations
    ...containerConfiguration
  );

  // configurations
  bindOrRebind(container, TYPES.Grid).toConstantValue({ x: 8, y: 8 });
  container.bind<IvyViewerOptions>(IVY_TYPES.IvyViewerOptions).toConstantValue(defaultIvyViewerOptions());
  container.bind<IHelperLineOptions>(TYPES.IHelperLineOptions).toConstantValue({
    alignmentElementFilter: element => !(element instanceof LaneNode) && DEFAULT_ALIGNABLE_ELEMENT_FILTER(element)
  });

  bindOrRebind(container, MarqueeUtil).to(IvyMarqueeUtil).inSingletonScope();
  bindOrRebind(container, TYPES.IMarqueeBehavior).toConstantValue({ entireEdge: true, entireElement: true });
  bindOrRebind(container, TYPES.ICommandStack).to(IvyGLSPCommandStack).inSingletonScope();
  bindOrRebind(container, TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  bindOrRebind(container, TYPES.LogLevel).toConstantValue(LogLevel.log);
  bindOrRebind(container, TYPES.ISnapper).to(GLSPCenterGridSnapper);

  container.rebind(DiagramLoader).to(IvyDiagramLoader).inSingletonScope();
  container.rebind(ModelViewer).to(IvyModelViewer).inSingletonScope();

  overrideViewerOptions(container, {
    baseDiv: widgetId,
    hiddenDiv: widgetId + '_hidden'
  });

  return container;
}
