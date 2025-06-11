import type { ThemeMode } from '@axonivy/process-editor-protocol';

export const prefsColorScheme = (): ThemeMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const currentTheme = (): ThemeMode => {
  return (document.documentElement.dataset.theme as ThemeMode) ?? prefsColorScheme();
};
