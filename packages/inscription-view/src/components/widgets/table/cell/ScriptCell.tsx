import type { CellContext } from '@tanstack/react-table';
import { CodeEditorCell } from './CodeEditorCell';
import { InputCell } from '@axonivy/ui-components';
import type { BrowserType } from '../../../browser/useBrowser';

export const ScriptCell = <TData,>({
  cell,
  type,
  browsers,
  placeholder
}: {
  cell: CellContext<TData, string>;
  type: string;
  browsers: BrowserType[];
  placeholder?: string;
}) => {
  if (type && type.length === 0) {
    return <InputCell cell={cell} placeholder={placeholder} />;
  }
  return <CodeEditorCell cell={cell} macro={false} type={type} browsers={browsers} placeholder={placeholder} />;
};
