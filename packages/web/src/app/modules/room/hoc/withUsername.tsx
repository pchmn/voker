import { ProfileEditor, useCurrentUser } from '@app/core/auth';
import { Center, Group, Text } from '@mantine/core';
import { useMatch } from '@tanstack/react-location';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function withUsername(Component: React.ElementType) {
  return function Render(): JSX.Element {
    const {
      params: { roomId }
    } = useMatch();
    const { data } = useCurrentUser();
    const { t } = useTranslation();
    // const {
    //   data: { username }
    // } = useMatch();

    if (!data) {
      return (
        <Center style={{ width: '100%', height: '100%' }}>
          <Group direction="column" grow>
            <Text size="xl">{roomId === 'create' ? t('withUsername.titleCreation') : t('withUsername.titleJoin')}</Text>
            <ProfileEditor showLabel={false} />
          </Group>
        </Center>
      );
    }

    return <Component />;
  };
}
