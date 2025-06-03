import './InscriptionTabs.css';
import { Tabs as TabsRoot, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import type { IvyIcons } from '@axonivy/ui-icons';
import { IvyIcon, StateDot } from '@axonivy/ui-components';
import { ErrorBoundary } from 'react-error-boundary';
import type { PartProps } from '../../editors/part/usePart';
import ErrorFallback from '../error/ErrorFallback';
import type { Severity } from '@axonivy/process-editor-inscription-protocol';
import { Control } from '../../editors/part/Part';

export type TabsProps = {
  tabs: PartProps[];
  value?: string;
  onChange?: (change: string) => void;
};

export const InscriptionTabs = (props: TabsProps) => (
  <InscriptionTabRoot {...props}>
    <InscriptionTabList {...props} />
    <InscriptionTabContent {...props} />
  </InscriptionTabRoot>
);

export const InscriptionTabRoot = ({ tabs, value, onChange, children }: TabsProps & { children: ReactNode }) => {
  const defaultTab = tabs.length > 0 ? tabs[0].id : '';
  return (
    <TabsRoot className='part-tabs-root' defaultValue={defaultTab} value={value} onValueChange={onChange}>
      {children}
    </TabsRoot>
  );
};

export const InscriptionTabList = ({ tabs }: TabsProps) => (
  <TabsList className={`part-tabs-list tabs-${tabs.length >= 5 ? 'many' : 'few'}`}>
    {tabs.map((tab, index) => (
      <InscriptionTabTrigger key={`${index}-${tab.id}`} tab={tab} tabIcon={tab.icon} />
    ))}
  </TabsList>
);

export const InscriptionTabContent = ({ tabs }: TabsProps) => (
  <>
    {tabs.map((tab, index) => (
      <TabsContent key={`${index}-${tab}`} className='part-tabs-content' value={tab.id}>
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[tab]}>
          <Control reset={tab.reset} name={tab.name} control={tab.control} className='reset-tab' />
          {tab.content}
        </ErrorBoundary>
      </TabsContent>
    ))}
  </>
);

export const InscriptionTabTrigger = ({ tab, tabIcon }: { tab: PartProps; tabIcon: IvyIcons }) => {
  const state = tab.state.validations?.find(message => message.severity === 'ERROR')
    ? 'error'
    : tab.state.validations?.find(message => message.severity === 'WARNING')
      ? 'warning'
      : undefined;

  return (
    <TabsTrigger className='part-tabs-trigger' data-message={state} value={tab.id} aria-label={tab.id} title={tab.name}>
      {tab.state.state !== undefined && (
        <StateDot
          state={tab.state.state}
          messages={tab.state.validations.map(({ message, severity }) => ({
            message,
            variant: severity.toLocaleLowerCase() as Lowercase<Severity>
          }))}
        />
      )}
      <IvyIcon icon={tabIcon} />
      <div className='tab-label'>{tab.name}</div>
    </TabsTrigger>
  );
};
