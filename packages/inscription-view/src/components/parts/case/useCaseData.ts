import type { CaseData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useCaseData(): ConfigDataContext<CaseData> & {
  update: DataUpdater<CaseData['case']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<CaseData['case']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.case[field] = value;
      })
    );
  };

  return {
    ...config,
    update
  };
}
