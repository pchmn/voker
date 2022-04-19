import { FlexLayout } from '@lib/ui';
import { MantineNumberSize, Title } from '@mantine/core';
import { keyframes, styled } from 'goober';
import React from 'react';
import { DynamicLogo } from '..';

const scale = keyframes({
  '0%': {
    transform: 'scale(0)'
  },
  '40% ': {
    transform: 'scale(1.2)'
  },
  '50%': {
    transform: 'scale(1.0)'
  }
});

const pulse = keyframes({
  '0%': {
    transform: 'scale(1.0)'
  },
  '40% ': {
    transform: 'scale(1.1)'
  },
  '50%': {
    transform: 'scale(1.0)'
  }
});

const translate = keyframes({
  '0%': {
    transform: 'translateY(-200%)',
    opacity: 0
  },
  '40% ': {
    transform: 'translateY(25%)',
    opacity: 1
  },
  '50%': {
    transform: 'translateY(0)',
    opacity: 1
  }
});

const Logo = styled(DynamicLogo)<{ animate: boolean }>(({ animate }) => ({
  animation: animate ? `${scale} 1s ease-in-out forwards, ${pulse} 1s ease infinite` : '',
  animationDelay: '0ms, 1.2s'
}));

const AppName = styled(Title)<{ animate: boolean }>(({ animate }) => ({
  animation: animate ? `${translate} 1s ease-in-out forwards` : '',
  margin: '0 !important',
  fontFamily: "'JetBrains Mono', monospace"
}));

interface AppLogoProps {
  direction?: 'row' | 'column';
  size?: MantineNumberSize;
  animate?: boolean;
  onAnimationEnd?: React.AnimationEventHandler<HTMLHeadingElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function AppLogo({ direction = 'column', size = 'sm', animate = false, onAnimationEnd, onClick }: AppLogoProps) {
  return (
    <FlexLayout direction={direction} spacing={size} onClick={onClick} alignItems="center" justifyContent="center">
      <Logo animate={animate} size={size} />
      <AppName
        animate={animate}
        order={size === 'sm' ? 2 : 1}
        onAnimationEnd={onAnimationEnd}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        Voker
      </AppName>
    </FlexLayout>
  );
}
