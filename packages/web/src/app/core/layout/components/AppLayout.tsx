import { AppLogo, GithubIcon } from '@app/shared/components';
import { FlexLayout } from '@lib/ui';
import { ActionIcon, AppShell, Header as MantineHeader, Space, Text, useMantineTheme } from '@mantine/core';
import { useNavigate } from '@tanstack/react-location';
import React, { PropsWithChildren } from 'react';
import { HeaderMenu } from './HeaderMenu';

export function AppLayout({ children }: PropsWithChildren<unknown>) {
  const navigate = useNavigate();

  const goToHome = () => navigate({ to: '' });

  return (
    <AppShell
      fixed
      header={
        <MantineHeader height={70} padding="md">
          <FlexLayout direction="row" justifyContent="space-between" fullHeight alignItems="center">
            <AppLogo direction="row" size="sm" onClick={goToHome} />
            <HeaderMenu />
          </FlexLayout>
        </MantineHeader>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 0
        }
      })}
    >
      <div style={{ flexGrow: 1 }}>{children}</div>
      <Footer />
    </AppShell>
  );
}

function Footer() {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#fff',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Text size="sm">Voker · Made by pchmn ·</Text>
      <Space w={5} />
      <ActionIcon size="sm">
        <GithubIcon />
      </ActionIcon>
    </div>
  );
}

// function Header() {
//   const { colorScheme, toggleColorScheme } = useMantineColorScheme();

//   return (
//     <MantineHeader height={70} padding="md">
//       <div
//         style={{
//           display: 'flex',
//           height: '100%',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexDirection: 'row'
//         }}
//       >
//         <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
//           <Text style={{ fontWeight: 800, fontSize: '2rem' }} color="violet">
//             Vo
//             <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
//               <span style={{ fontWeight: 200 }}>ting Po</span>
//             </MediaQuery>
//             ker
//           </Text>
//         </div>
//         <div style={{ marginLeft: 'auto' }}>
//           <ActionIcon onClick={() => toggleColorScheme()}>
//             {colorScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
//           </ActionIcon>
//         </div>
//       </div>
//     </MantineHeader>
//   );
// }
