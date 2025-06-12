import { BasicInscriptionTabs, Flex } from '@axonivy/ui-components';
import { useInscriptionTabState, type PartProps } from './usePart';

import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../widgets/error/ErrorFallback';

const Part = ({ parts }: { parts: PartProps[] }) => {
  const { value, updateValue } = useInscriptionTabState(parts);
  return (
    <BasicInscriptionTabs
      tabs={parts.map(p => {
        const content = (
          <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[p]}>
            {p.control && (
              <Flex direction='row' gap={2} justifyContent='flex-end'>
                {p.control}
              </Flex>
            )}
            {p.content}
          </ErrorBoundary>
        );
        return { ...p, content };
      })}
      value={value}
      onChange={updateValue}
    />
  );
};

export default Part;
