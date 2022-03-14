import { ProfileEditor } from '@app/core/auth';
import { ColorPaletteIcon, SettingsIcon, UserIcon } from '@app/shared/components';
import { Icon, ThemeEditor } from '@lib/ui';
import { ActionIcon, Menu, Modal } from '@mantine/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function HeaderMenu() {
  const { t } = useTranslation();
  const [themeEditorOpened, setThemeEditorOpened] = useState(false);
  const [profileEditorOpened, setProfileEditorOpened] = useState(false);

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
          onClick={() => setProfileEditorOpened(true)}
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
      <Modal
        size="xs"
        opened={profileEditorOpened}
        onClose={() => setProfileEditorOpened(false)}
        title={t('header.profileEditor.title')}
      >
        <ProfileEditor onClose={() => setProfileEditorOpened(false)} />
      </Modal>
    </>
  );
}
