import type { ResultData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useResultData(): ConfigDataContext<ResultData> & {
  update: DataUpdater<ResultData['result']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ResultData['result']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.result[field] = value;
      })
    );
  };

  return {
    ...config,
    update
  };
}
