import { ThemeSettingsContext, useThemeSettings } from '@lib/ui';
import { ColorSchemeProvider, MantineProvider, TypographyStylesProvider } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

export function VokerUiProvider({ children }: PropsWithChildren<unknown>) {
  const { themeSettings, toggleColorScheme, setPrimaryColor } = useThemeSettings();
  console.log('themeSettings', themeSettings);

  return (
    <ThemeSettingsContext.Provider value={{ themeSettings, toggleColorScheme, setPrimaryColor }}>
      <ColorSchemeProvider colorScheme={themeSettings?.colorScheme || 'dark'} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={themeSettings}>
          <TypographyStylesProvider>{children}</TypographyStylesProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </ThemeSettingsContext.Provider>
  );
}
