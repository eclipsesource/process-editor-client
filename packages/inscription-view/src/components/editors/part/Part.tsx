import { IvyIcons } from '@axonivy/ui-icons';
import { Button, Flex } from '@axonivy/ui-components';
import { useInscriptionTabState, type PartProps } from './usePart';

import { useTranslation } from 'react-i18next';
import { InscriptionTabs } from '../../widgets/inscription-tabs/InscriptionTabs';

export const Control = ({ name, reset, control, ...props }: Pick<PartProps, 'name' | 'reset' | 'control'> & { className: string }) => {
  const { t } = useTranslation();

  return (
    <Flex direction='row' gap={2} justifyContent='flex-end' {...props}>
      {control}
      <Button
        icon={IvyIcons.Undo}
        onClick={reset.action}
        title={t('label.resetPart', { name })}
        aria-label={t('label.resetPart', { name })}
        disabled={!reset.dirty}
      />
    </Flex>
  );
};

const Part = ({ parts }: { parts: PartProps[] }) => {
  const { value, updateValue } = useInscriptionTabState(parts);
  return <InscriptionTabs tabs={parts} value={value} onChange={updateValue} />;
};

export default Part;
