import { MoonIcon, SunIcon } from '@app/components';
import { ActionIcon, AppShell, Header, Title, useMantineColorScheme } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren<unknown>) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      fixed
      header={
        <Header height={70} padding="md">
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row'
            }}
          >
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
              <Title order={1} style={{ fontWeight: 800 }}>
                Vo<span style={{ fontWeight: 400 }}>ting</span> <span style={{ fontWeight: 400 }}>Po</span>ker
              </Title>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <ActionIcon onClick={() => toggleColorScheme()}>
                {colorScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </ActionIcon>
            </div>
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] }
      })}
    >
      {children}
    </AppShell>
  );
}
