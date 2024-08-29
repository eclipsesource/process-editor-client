import {
  Bounds,
  GLSPProjectionView,
  GridManager,
  GViewportRootElement,
  IViewArgs,
  RenderingContext,
  SGraphImpl,
  Writable
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

@injectable()
export class IvyGraphView extends GLSPProjectionView {
  protected firstRender = false;

  render(model: Readonly<GViewportRootElement>, context: RenderingContext, args?: IViewArgs): VNode {
    if (!this.firstRender && model.id !== 'EMPTY') {
      console.log('[DEBUG] Graph model is rendered for the first time', Date.now().toFixed(2));
      this.firstRender = true;
    }
    return super.render(model, context, args);
  }
  protected override getBackgroundBounds(
    viewport: Readonly<SGraphImpl>,
    context: RenderingContext,
    gridManager: GridManager
  ): Writable<Bounds> {
    // we define our grid as 8x8 for all intents and purposes of moving, resizing, etc.
    // however visually we render it 16x16 giving the illusion of half-grid movement
    // alternatively this could be achieved by adapting the grid snapper
    const bounds = super.getBackgroundBounds(viewport, context, gridManager);
    bounds.height = bounds.height * 2;
    bounds.width = bounds.width * 2;
    return bounds;
  }
}
