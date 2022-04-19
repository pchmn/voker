import { useStorage } from '@lib/core';
import { ColorScheme, MantineColor, MantineThemeOverride } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { createContext } from 'react';

type ThemeSettingsContext = {
  themeSettings: MantineThemeOverride | undefined;
  toggleColorScheme: (value?: ColorScheme | undefined) => void;
  setPrimaryColor: (primaryColor: MantineColor) => void;
};

export const ThemeSettingsContext = createContext({} as ThemeSettingsContext);

export function useThemeSettings() {
  const preferredColorScheme = useColorScheme();

  const [themeSettings, setThemeSettings] = useStorage<MantineThemeOverride>({
    key: 'mantineThemeSettings',
    defaultValue: {
      primaryColor: 'violet',
      colorScheme: preferredColorScheme
    }
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    console.log('toggleColorSchem');
    setThemeSettings({
      ...themeSettings,
      colorScheme: value || (themeSettings?.colorScheme === 'dark' ? 'light' : 'dark')
    });
  };

  const setPrimaryColor = (primaryColor: MantineColor) => {
    setThemeSettings({
      ...themeSettings,
      primaryColor
    });
  };

  return { themeSettings, setThemeSettings, toggleColorScheme, setPrimaryColor };
}
