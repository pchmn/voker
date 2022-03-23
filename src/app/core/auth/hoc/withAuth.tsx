import { DynamicLogo } from '@app/shared/components';
import { useFirebaseAuth } from '@lib/core';
import { AppShell, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import './withAuth.scss';

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

    const onAnimation = (start: boolean) => console.log(`animation ${start ? 'started' : 'finished'}`);

    if (loading || !animationEnded) {
      return (
        <AppShell
          fixed
          styles={(theme) => ({
            main: {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }
          })}
          className="withAuth"
        >
          <DynamicLogo size="xl" className="appLogo" />
          <Title
            className="appName"
            order={1}
            onAnimationStart={() => onAnimation(true)}
            onAnimationEnd={() => setAnimationEnded(true)}
          >
            Voker
          </Title>
        </AppShell>
      );
    }

    return <Component />;
  };
}
