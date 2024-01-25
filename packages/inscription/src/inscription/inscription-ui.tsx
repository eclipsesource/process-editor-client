import { InscriptionClientJsonRpc, IvyScriptLanguage, MonacoUtil } from '@axonivy/inscription-core';
import { ClientContextProvider, MonacoEditorUtil, ThemeContextProvider, initQueryClient } from '@axonivy/inscription-editor';
import { InscriptionClient, InscriptionContext } from '@axonivy/inscription-protocol';
import { SwitchThemeActionHandler } from '@axonivy/process-editor';
import { SwitchThemeAction } from '@axonivy/process-editor-protocol';
import {
  AbstractUIExtension,
  Action,
  GArgument,
  GModelRoot,
  IActionHandler,
  ISelectionListener,
  SelectionService,
  SetUIExtensionVisibilityAction,
  isNotUndefined,
  isOpenable
} from '@eclipse-glsp/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { inject, injectable, optional, postConstruct } from 'inversify';
import * as reactMonaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { OpenAction } from 'sprotty-protocol';
import InscriptionView from './InscriptionView';
import { EnableInscriptionAction, ToggleInscriptionAction } from './action';

const JSX = { createElement: React.createElement };

@injectable()
export class InscriptionUi extends AbstractUIExtension implements IActionHandler, ISelectionListener {
  static readonly ID = 'inscriptionUi';

  @inject(SelectionService) protected readonly selectionService: SelectionService;
  @inject(SwitchThemeActionHandler) @optional() protected switchThemeHandler?: SwitchThemeActionHandler;

  private inscriptionElement?: string;
  private action?: EnableInscriptionAction;
  private inscriptionContext: InscriptionContext;
  private root: Root;
  private inscriptionClient?: Promise<InscriptionClient>;
  private queryClient: QueryClient;

  public id(): string {
    return InscriptionUi.ID;
  }

  @postConstruct()
  protected init(): void {
    this.selectionService.onSelectionChanged(event => this.selectionChanged(event.root, event.selectedElements));
  }

  public containerClass(): string {
    return 'inscription-ui-container';
  }

  protected initialize() {
    const baseDiv = document.getElementById('inscription');
    if (!baseDiv) {
      this.logger.warn(this, `Could not obtain inscription base container for initializing UI extension ${this.id}`, this);
      return false;
    }
    this.containerElement = this.getOrCreateContainer(baseDiv.id);
    this.initializeContents(this.containerElement);
    if (baseDiv) {
      baseDiv.insertBefore(this.containerElement, baseDiv.firstChild);
    }
    return true;
  }

  protected initializeContents(containerElement: HTMLElement) {
    this.changeUiVisiblitiy(false);
    this.inscriptionContext = this.initInscriptionContext();
    this.queryClient = initQueryClient();
    this.inscriptionClient = this.startInscriptionClient();
    this.root = createRoot(containerElement);
  }

  private updateInscriptionUi() {
    if (!this.inscriptionElement) {
      return;
    }
    const element = this.inscriptionElement;
    this.inscriptionClient?.then(client => {
      this.root.render(
        <React.StrictMode>
          <ThemeContextProvider theme={this.switchThemeHandler?.theme() ?? 'light'}>
            <ClientContextProvider client={client}>
              <QueryClientProvider client={this.queryClient}>
                <InscriptionView app={this.inscriptionContext.app} pmv={this.inscriptionContext.pmv} pid={element} />
              </QueryClientProvider>
            </ClientContextProvider>
          </ThemeContextProvider>
        </React.StrictMode>
      );
    });
  }

  async startInscriptionClient() {
    const model = this.selectionService.getModelRoot();
    const webSocketAddress = this.action?.connection?.server ?? GArgument.getString(model, 'webSocket') ?? 'ws://localhost:8081/';
    if (this.action?.connection?.ivyScript) {
      await IvyScriptLanguage.startClient(this.action?.connection?.ivyScript);
    } else {
      await IvyScriptLanguage.startWebSocketClient(webSocketAddress);
    }
    let client: InscriptionClient;
    if (this.action?.connection?.inscription) {
      client = await InscriptionClientJsonRpc.startClient(this.action.connection.inscription);
    } else {
      client = await InscriptionClientJsonRpc.startWebSocketClient(webSocketAddress);
    }
    await client.initialize();
    return client;
  }

  handle(action: Action) {
    if (EnableInscriptionAction.is(action)) {
      this.action = action;
      return SetUIExtensionVisibilityAction.create({ extensionId: InscriptionUi.ID, visible: true });
    }
    if (ToggleInscriptionAction.is(action)) {
      if (!this.inscriptionElement) {
        this.inscriptionElement = this.selectionService.getModelRoot().id;
        this.updateInscriptionUi();
      }
      this.changeUiVisiblitiy(action.force);
    }
    if (Action.is(action) && action.kind === OpenAction.KIND) {
      this.changeUiVisiblitiy(true);
    }
    if (SwitchThemeAction.is(action)) {
      this.updateInscriptionUi();
      MonacoUtil.monacoInitialized().then(() => {
        reactMonaco.editor.defineTheme(MonacoEditorUtil.DEFAULT_THEME_NAME, MonacoEditorUtil.themeData(action.theme));
      });
    }
    return;
  }

  private initInscriptionContext() {
    const model = this.selectionService.getModelRoot();
    if (this.action?.inscriptionContext) {
      return this.action.inscriptionContext;
    }
    return {
      app: GArgument.getString(model, 'app') ?? 'designer',
      pmv: GArgument.getString(model, 'pmv') ?? ''
    };
  }

  private changeUiVisiblitiy(force?: boolean) {
    const baseDiv = document.getElementById('inscription');
    if (!baseDiv) {
      return;
    }
    if (force !== undefined) {
      if (force) {
        baseDiv.classList.remove('hidden');
      } else {
        baseDiv.classList.add('hidden');
      }
    } else {
      baseDiv.classList.toggle('hidden');
    }
    window.dispatchEvent(new CustomEvent('resize'));
  }

  selectionChanged(root: Readonly<GModelRoot>, selectedElements: string[]): void {
    const selected = selectedElements
      .map(id => root.index.getById(id))
      .filter(isNotUndefined)
      .filter(isOpenable)[0];
    if (selected) {
      this.inscriptionElement = selected.id;
    } else {
      this.inscriptionElement = this.inscriptionElement ? root.id : undefined;
      this.changeUiVisiblitiy(false);
    }
    this.updateInscriptionUi();
  }
}
