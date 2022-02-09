import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import React, { PropsWithChildren, useState } from 'react';

export function VokerUiProvider({ children }: PropsWithChildren<unknown>) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  console.log('color scheme', colorScheme);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{
          primaryColor: 'violet',
          colorScheme
        }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
