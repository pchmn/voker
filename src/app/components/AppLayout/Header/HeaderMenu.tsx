import { ColorPaletteIcon, SettingsIcon, UserIcon } from '@app/components';
import { Icon, ThemeEditor } from '@lib/ui';
import { ActionIcon, Menu } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function HeaderMenu() {
  const { t } = useTranslation();
  const [themeEditorOpened, setThemeEditorOpened] = useState(false);

  useEffect(() => console.log('in HeaderMenu'), []);

  return (
    <>
      <Menu
        control={
          <ActionIcon>
            <SettingsIcon />
          </ActionIcon>
        }
        style={{ verticalAlign: 'middle' }}
      >
        <Menu.Label>{t('header.settings')}</Menu.Label>
        <Menu.Item
          icon={
            <Icon size="xs">
              <UserIcon />
            </Icon>
          }
        >
          {t('header.editProfile')}
        </Menu.Item>
        <Menu.Item
          icon={
            <Icon size="xs">
              <ColorPaletteIcon />
            </Icon>
          }
          onClick={() => setThemeEditorOpened(true)}
        >
          {t('header.customizeTheme')}
        </Menu.Item>
      </Menu>
      <ThemeEditor opened={themeEditorOpened} onClose={() => setThemeEditorOpened(false)} />
    </>
  );
}
