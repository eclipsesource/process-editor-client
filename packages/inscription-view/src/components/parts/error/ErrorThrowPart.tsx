import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ErrorThrowData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useErrorThrowData } from './useErrorThrowData';
import { classifiedItemInfo } from '../../../utils/event-code-categorie';
import { deepEqual } from '../../../utils/equals';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import type { ClassifiedItem } from '../common/classification/ClassificationCombobox';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';
import ClassificationCombobox from '../common/classification/ClassificationCombobox';
import { ScriptInput } from '../../widgets/code-editor/ScriptInput';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';
import { useTranslation } from 'react-i18next';

export function useErrorThrowPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, reset } = useErrorThrowData();
  const compareData = (data: ErrorThrowData) => [data];
  const validations = [...useValidations(['throws']), ...useValidations(['code'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: t('part.error.title'),
    state,
    reset: { dirty, action: () => reset() },
    content: <ErrorThrowPart />
  };
}

const ErrorThrowPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update, updateThrows } = useErrorThrowData();
  const { context } = useEditorContext();
  const errorCodes = [
    ...useMeta('meta/workflow/errorCodes', { context, thrower: true }, []).data.map<ClassifiedItem>(code => {
      return { ...code, value: code.eventCode, info: classifiedItemInfo(code) };
    })
  ];
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <>
      <PathCollapsible label={t('part.error.title')} path='throws' defaultOpen={!deepEqual(config.throws, defaultConfig.throws)}>
        <PathFieldset label={t('part.error.codeToThrow')} path='error'>
          <ClassificationCombobox
            value={config.throws.error}
            onChange={change => updateThrows('error', change)}
            data={errorCodes}
            icon={IvyIcons.Error}
          />
        </PathFieldset>
        <PathFieldset label={t('part.error.cause')} path='cause'>
          <ScriptInput
            value={config.throws.cause}
            onChange={change => updateThrows('cause', change)}
            type={IVY_SCRIPT_TYPES.BPM_ERROR}
            browsers={['attr', 'func', 'type']}
          />
        </PathFieldset>
      </PathCollapsible>
      <PathCollapsible label={t('label.code')} path='code' controls={[maximizeCode]} defaultOpen={config.code !== defaultConfig.code}>
        <ValidationFieldset>
          <ScriptArea
            maximizeState={maximizeState}
            value={config.code}
            onChange={change => update('code', change)}
            browsers={['attr', 'func', 'type', 'cms']}
          />
        </ValidationFieldset>
      </PathCollapsible>
    </>
  );
};
