import { Button, Center, Text, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-location';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goTo = (to: string) => navigate({ to });

  return (
    <Center style={{ marginTop: '50px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Title order={1} style={{ fontSize: '3rem' }}>
          {t('home.title')}
        </Title>
        <Text>{t('home.helper')}</Text>

        <div style={{ marginTop: '20px' }}>
          <Button size="md" style={{ marginRight: '20px' }} onClick={() => goTo('room/create')}>
            {t('home.createNewRoom')}
          </Button>
          <Button variant="outline" size="md">
            {t('home.joinARoom')}
          </Button>
        </div>
      </div>
    </Center>
  );
}