import {
  ApplicationIdProvider,
  DiagramLoader,
  DiagramLoadingOptions,
  EMPTY_ROOT,
  GLSPClient,
  GModelRoot,
  ModelViewer,
  Ranked,
  ResolvedDiagramLoadingOptions,
  SetModelAction
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { Action } from 'sprotty-protocol/lib/actions';

@injectable()
export class IvyDiagramLoader extends DiagramLoader {
  async load(options: DiagramLoadingOptions = {}): Promise<void> {
    console.time('[Debug] DiagramLoader.load');
    const start = Date.now();
    this.diagramStartups.sort(Ranked.sort);
    await this.invokeStartupHook('preLoadDiagram');
    console.log('[Debug] Preload hook concluded after:', (Date.now() - start).toFixed(2) + 'ms');
    const resolvedOptions: ResolvedDiagramLoadingOptions = {
      requestModelOptions: {
        sourceUri: this.options.sourceUri ?? '',
        diagramType: this.options.diagramType,
        ...options.requestModelOptions
      },
      initializeParameters: {
        applicationId: ApplicationIdProvider.get(),
        protocolVersion: GLSPClient.protocolVersion,
        ...options.initializeParameters
      },
      enableNotifications: options.enableNotifications ?? true
    };
    // Set empty place holder model until actual model from server is available
    await this.actionDispatcher.dispatch(SetModelAction.create(EMPTY_ROOT));
    await this.invokeStartupHook('preInitialize');
    console.log('[Debug] Pre initialize hook concluded after :', (Date.now() - start).toFixed(2) + 'ms');
    await this.initialize(resolvedOptions);
    await this.invokeStartupHook('preRequestModel');
    console.log('[Debug] Pre request model hook concluded after :', (Date.now() - start).toFixed(2) + 'ms');
    await this.requestModel(resolvedOptions);
    console.log('[Debug] Request model concluded after :', (Date.now() - start).toFixed(2) + 'ms');
    await this.invokeStartupHook('postRequestModel');
    console.log('[Debug] Post request model hook concluded after :', (Date.now() - start).toFixed(2) + 'ms');
    this.modelInitializationConstraint.onInitialized(() => this.invokeStartupHook('postModelInitialization'));
    console.timeEnd('[Debug] DiagramLoader.load');
    console.log('[Debug] Diagram load finished after :', (Date.now() - start).toFixed(2) + 'ms');
    console.timeEnd('[Debug] appStart');
  }
}

@injectable()
export class IvyModelViewer extends ModelViewer {
  firstRender = false;

  update(model: Readonly<GModelRoot>, cause?: Action): void {
    super.update(model, cause);
    if (model.id !== EMPTY_ROOT.id && !this.firstRender) {
      console.timeEnd('[Debug] firstDiagramRender');
      this.firstRender = true;
    }
  }
}
