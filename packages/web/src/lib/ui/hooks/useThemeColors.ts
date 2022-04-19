import { MantineColor, useMantineTheme } from '@mantine/core';

export function useThemeColors() {
  const theme = useMantineTheme();
  const colors = Object.keys(theme.colors) as Array<MantineColor>;

  return { primaryColor: theme.primaryColor, colors };
}
