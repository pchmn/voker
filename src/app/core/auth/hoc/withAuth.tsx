import { DynamicLogo } from '@app/shared/components';
import { useFirebaseAuth } from '@lib/core';
import { Title } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import { keyframes, styled } from 'goober';
import React, { useEffect, useState } from 'react';

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

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh'
}));

const AppLogo = styled(DynamicLogo)(() => ({
  animation: `${scale} 1s ease-in-out forwards, ${pulse} 1s ease infinite`,
  animationDelay: '0ms, 1.2s'
}));

const AppName = styled(Title)(() => ({
  animation: `${translate} 1s ease-in-out forwards`,
  marginTop: '0 !important'
}));

export function withAuth(Component: React.ElementType) {
  return function Render(): JSX.Element {
    const { signIn } = useFirebaseAuth();
    const [loading, setLoading] = useState(true);
    const [animationEnded, setAnimationEnded] = useState(false);

    useEffect(() => {
      signIn().then(() => {
        setLoading(false);
      });
    }, [signIn]);

    if (loading || !animationEnded) {
      return (
        <Container>
          <AppLogo size="xl" />
          <AppName order={1} onAnimationEnd={() => setAnimationEnded(true)}>
            Voker
          </AppName>
        </Container>
      );
    }

    return (
      <Container>
        <AnimatePresence>
          <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Component />
          </motion.div>
        </AnimatePresence>
      </Container>
    );
  };
}
