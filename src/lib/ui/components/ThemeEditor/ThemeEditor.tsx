import { ColorPicker, Icon, useThemeSettings } from '@lib/ui';
import { Box, Button, Center, Group, Modal, SegmentedControl, Space, Title } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function ThemeEditor({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const { themeSettings, toggleColorScheme } = useThemeSettings();
  const { t } = useTranslation();

  return (
    <>
      <Modal opened={opened} onClose={onClose} title={t('ui.themeEditor.title')}>
        <Space h="md" />
        <Group position="center" direction="column">
          <Title order={6}>{t('ui.themeEditor.background')}</Title>
          <SegmentedControl
            value={themeSettings?.colorScheme}
            onChange={() => toggleColorScheme()}
            data={[
              {
                value: 'dark',
                label: (
                  <Center>
                    <Icon size="xs">
                      <MoonIcon />
                    </Icon>
                    <Box ml={10}>{t('ui.themeEditor.dark')}</Box>
                  </Center>
                )
              },
              {
                value: 'light',
                label: (
                  <Center>
                    <Icon size="xs">
                      <SunIcon />
                    </Icon>
                    <Box ml={10}>{t('ui.themeEditor.light')}</Box>
                  </Center>
                )
              }
            ]}
          />
          <Space h="xs" />

          <Title order={6}>{t('ui.themeEditor.color')}</Title>
          <ColorPicker />
          <Space h="md" />

          <Button onClick={() => onClose()}>{t('ui.themeEditor.validate')}</Button>
        </Group>
      </Modal>
    </>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"></path>
        <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"></path>
        <path d="M19 11h2m-1-1v2"></path>
      </g>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"></path>
      </g>
    </svg>
  );
}
