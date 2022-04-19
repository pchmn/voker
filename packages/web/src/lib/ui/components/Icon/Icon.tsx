import { MantineColor, MantineNumberSize, useMantineTheme } from '@mantine/core';
import React from 'react';

interface IconProps {
  size?: MantineNumberSize;
  color?: string | MantineColor;
}
const sizes = {
  xs: 16,
  sm: 20,
  md: 26,
  lg: 32,
  xl: 40
};

export function Icon({ size = 'md', color, children }: React.PropsWithChildren<IconProps>) {
  const theme = useMantineTheme();
  const iconSize = theme.fn.size({ size, sizes });

  return (
    <div
      style={{
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        minHeight: iconSize,
        color
      }}
    >
      {children}
    </div>
  );
}
