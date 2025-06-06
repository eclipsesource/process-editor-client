import type { ProgramInterfaceStartData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../editors/part/usePart';
import { useProgramInterfaceData } from './useProgramInterfaceData';
import JavaClassSelector from '../JavaClassSelector';
import { useValidations } from '../../../../context/useValidation';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useProgramInterfaceStartPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, resetJavaClass } = useProgramInterfaceData();
  const compareData = (data: ProgramInterfaceStartData) => [data.javaClass];
  const validation = useValidations(['javaClass']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    id: 'Java Bean',
    name: t('part.program.start.title'),
    state,
    reset: { dirty, action: () => resetJavaClass() },
    content: <ProgramInterfaceStartPart />,
    icon: IvyIcons.StartProgram
  };
}

const ProgramInterfaceStartPart = ({ thirdParty }: { thirdParty?: boolean }) => {
  const { config, update } = useProgramInterfaceData();

  return (
    <>
      {(thirdParty === undefined || thirdParty === false) && (
        <JavaClassSelector javaClass={config.javaClass} onChange={change => update('javaClass', change)} type='ACTIVITY' />
      )}
    </>
  );
};
