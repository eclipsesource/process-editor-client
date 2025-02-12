import './ScriptArea.css';
import type { CodeEditorAreaProps } from './ResizableCodeEditor';
import { ResizableCodeEditor } from './ResizableCodeEditor';
import { monacoAutoFocus, useMonacoEditor } from './useCodeEditor';
import type { ElementRef } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useOnFocus } from '../../../components/browser/useOnFocus';
import { InputBadgeArea, useField } from '@axonivy/ui-components';
import { badgePropsExpression } from '../../../utils/badgeproperties';
import { MaximizedCodeEditorBrowser } from '../../browser/MaximizedCodeEditorBrowser';
import Browser from '../../browser/Browser';
import { useBrowser } from '../../browser/useBrowser';
import { usePath } from '../../../context/usePath';
import { MonacoEditorUtil } from '../../../monaco/monaco-editor-util';

export const MacroArea = ({ value, onChange, browsers, ...props }: CodeEditorAreaProps) => {
  const { isFocusWithin, focusWithinProps, focusValue } = useOnFocus(value, onChange);
  const browser = useBrowser();
  const { setEditor, modifyEditor, getSelectionRange } = useMonacoEditor({ modifyAction: value => `<%=${value}%>` });
  const path = usePath();
  const areaRef = useRef<ElementRef<'output'>>(null);
  const { inputProps } = useField();
  const [monacoInitHeight, setMonacoInitHeight] = useState<number | undefined>(undefined);
  useEffect(() => setMonacoInitHeight(areaRef.current?.offsetHeight), []);

  return (
    // tabIndex is needed for safari to catch the focus when click on browser button
    <div className='script-area' {...focusWithinProps} tabIndex={1}>
      {isFocusWithin || browser.open || props.maximizeState?.isMaximizedCodeEditorOpen ? (
        <>
          {props.maximizeState && (
            <MaximizedCodeEditorBrowser
              open={props.maximizeState.isMaximizedCodeEditorOpen}
              onOpenChange={props.maximizeState.setIsMaximizedCodeEditorOpen}
              browsers={browsers}
              editorValue={value}
              location={path}
              applyEditor={focusValue.onChange}
              selectionRange={getSelectionRange()}
              macro={true}
            />
          )}
          {!props.maximizeState?.isMaximizedCodeEditorOpen && (
            <>
              <ResizableCodeEditor
                {...focusValue}
                {...inputProps}
                {...props}
                location={path}
                onMountFuncs={[setEditor, monacoAutoFocus, MonacoEditorUtil.keyActionEscShiftTab]}
                macro={true}
                initHeight={monacoInitHeight}
              />
              <Browser {...browser} types={browsers} accept={modifyEditor} location={path} />
            </>
          )}
        </>
      ) : (
        <InputBadgeArea badgeProps={badgePropsExpression} value={value} tabIndex={0} {...inputProps} {...props} ref={areaRef} />
      )}
    </div>
  );
};
