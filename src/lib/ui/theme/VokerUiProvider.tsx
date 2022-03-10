import { ThemeSettingsContext, useThemeSettings } from '@lib/ui';
import { MantineProvider, TypographyStylesProvider } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

export function VokerUiProvider({ children }: PropsWithChildren<unknown>) {
  const { themeSettings, toggleColorScheme, setPrimaryColor } = useThemeSettings();

  return (
    <ThemeSettingsContext.Provider value={{ themeSettings, toggleColorScheme, setPrimaryColor }}>
      <MantineProvider theme={themeSettings}>
        <TypographyStylesProvider>{children}</TypographyStylesProvider>
      </MantineProvider>
    </ThemeSettingsContext.Provider>
  );
}
