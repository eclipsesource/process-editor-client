import type { EventData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';

export function useEventData(): ConfigDataContext<EventData> & {
  update: DataUpdater<EventData>;
  updateTimeout: DataUpdater<EventData['timeout']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<EventData> = (field, value) => {
    setConfig(
      produce((draft: EventData) => {
        draft[field] = value;
      })
    );
  };

  const updateTimeout: DataUpdater<EventData['timeout']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.timeout[field] = value;
      })
    );
  };

  return {
    ...config,
    update,
    updateTimeout
  };
}
