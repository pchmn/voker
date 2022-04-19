import { AppLogo } from '@app/shared/components';
import { useFirebaseAuth } from '@lib/core';
import { FlexLayout } from '@lib/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { styled } from 'goober';
import React, { useEffect, useState } from 'react';

const Container = styled(FlexLayout)(({ theme }) => ({
  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  height: '100vh'
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
        <Container alignItems="center" justifyContent="center">
          <AppLogo size="xl" onAnimationEnd={() => setAnimationEnded(true)} animate />
        </Container>
      );
    }

    return (
      <Container alignItems="center" justifyContent="center">
        <AnimatePresence>
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Component />
          </motion.div>
        </AnimatePresence>
      </Container>
    );
  };
}
