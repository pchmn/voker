import { ThemeSettingsContext, useThemeSettings } from '@lib/ui';
import { MantineProvider, TypographyStylesProvider } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

export function VokerUiProvider({ children }: PropsWithChildren<unknown>) {
  const { themeSettings, toggleColorScheme, setPrimaryColor } = useThemeSettings();

  return (
    <ThemeSettingsContext.Provider value={{ themeSettings, toggleColorScheme, setPrimaryColor }}>
      <MantineProvider
        theme={{
          ...themeSettings,
          fontFamily: '"Readex Pro", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          headings: {
            fontFamily: '"Readex Pro", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
          },
          radius: {
            sm: 8
          }
        }}
      >
        <TypographyStylesProvider>{children}</TypographyStylesProvider>
      </MantineProvider>
    </ThemeSettingsContext.Provider>
  );
}
