import { RectangularNodeView, RenderingContext, SLabel, SLabelView } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { LaneNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class LaneNodeView extends RectangularNodeView {
  render(node: LaneNode, context: RenderingContext): VNode {
    return <g>
      <rect class-sprotty-node={true} x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}></rect>
      {this.getDecoratorLine(node)}
      {context.renderChildren(node)}
    </g>;
  }

  protected getDecoratorLine(node: LaneNode): VNode {
    return <g></g>;
  }

}

@injectable()
export class PoolNodeView extends LaneNodeView {
  protected getDecoratorLine(node: LaneNode): VNode {
    return <rect class-sprotty-node={true} x="0" y="0" width={30} height={Math.max(node.size.height, 0)}></rect>;
  }
}

@injectable()
export class RotateLabelView extends SLabelView {
  render(label: Readonly<SLabel>, context: RenderingContext): VNode | undefined {
    const rotate = `rotate(270) translate(-${label.bounds.height / 2} ${label.bounds.width / 2})`;
    return <text class-sprotty-label={true} transform={rotate} >
      <tspan>{label.text}</tspan>
    </text>;
  }
}