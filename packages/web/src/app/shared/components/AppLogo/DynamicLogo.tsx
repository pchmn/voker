import { MantineNumberSize, useMantineTheme } from '@mantine/core';
import { styled } from 'goober';
import React from 'react';

const sizes = {
  xs: 38,
  sm: 48,
  md: 58,
  lg: 78,
  xl: 110
};

interface DynamicLogoProps {
  size?: MantineNumberSize;
  className?: string;
  onAnimationEnd?: React.AnimationEventHandler<SVGElement>;
}

const Logo = styled('div')<{ size: number }>(
  ({ size }) => `
  width: ${size}px;
  height: ${size}px;
  minWidth: ${size}px;
  minHeight: ${size}px;
  display: flex;
  .card {
    filter: drop-shadow(0px 4px 4px rgb(0 0 0 / 0.4));
  }
`
);

export function DynamicLogo({ size = 'md', className, onAnimationEnd }: DynamicLogoProps) {
  const theme = useMantineTheme();
  const iconSize = theme.fn.size({ size, sizes });

  return (
    <Logo size={iconSize}>
      <svg
        className={className}
        viewBox="0 0 449 338"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onAnimationEnd={onAnimationEnd}
      >
        <path
          className="card"
          d="M5.02082 136.021C-1.6181 129.382 -1.6181 118.618 5.02082 111.979L111.794 5.20606C118.433 -1.43286 129.197 -1.43286 135.836 5.20606L316.855 186.225C323.494 192.864 323.494 203.628 316.855 210.267L210.082 317.04C203.443 323.679 192.679 323.679 186.04 317.04L5.02082 136.021Z"
          fill={theme.colors[theme.primaryColor][9]}
        />
        <path
          className="card"
          d="M299.04 5.02082C305.679 -1.61809 316.443 -1.61809 323.082 5.02082L429.855 111.794C436.494 118.433 436.494 129.197 429.855 135.836L248.836 316.855C242.197 323.494 231.433 323.494 224.794 316.855L118.021 210.082C111.382 203.443 111.382 192.679 118.021 186.04L299.04 5.02082Z"
          fill={theme.colors[theme.primaryColor][5]}
        />
      </svg>
    </Logo>
  );
}
