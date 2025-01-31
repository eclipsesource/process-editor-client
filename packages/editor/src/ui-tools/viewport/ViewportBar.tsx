import { Action } from '@eclipse-glsp/client';
import React from 'react';
import ActionButton, { ActionTrigger } from '../tool-bar/ActionButton';

type ViewportBarButton = ActionTrigger;

type ViewportBarProps = {
  triggers: ViewportBarButton[];
  onAction: (action: Action) => void;
  zoomLevel: string;
};

const ViewportBar = React.memo(({ triggers, onAction, zoomLevel }: ViewportBarProps) => (
  <div className='viewport-bar'>
    <div className='viewport-bar-tools'>
      {triggers.map(trigger => (
        <ActionButton key={trigger.id} trigger={trigger} onAction={onAction} />
      ))}
      <label>{zoomLevel}</label>
    </div>
  </div>
));

export default ViewportBar;
