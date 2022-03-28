import { ProfileEditor } from '@app/core/auth';
import { ColorPaletteIcon, SettingsIcon, UserIcon } from '@app/shared/components';
import { Icon, ThemeEditor, useModal } from '@lib/ui';
import { ActionIcon, Menu } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function HeaderMenu() {
  const { t } = useTranslation();
  const { Modal: ProfileEditorModal, toggle: toggleProfileEditorModal } = useModal(ProfileEditor, undefined, {
    title: t('header.profileEditor.title'),
    size: 'xs'
  });
  const { Modal: ThemeEditorModal, toggle: toggleThemeEditorModal } = useModal(ThemeEditor, undefined, {
    title: t('ui.themeEditor.title'),
    size: 'sm'
  });

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
          onClick={toggleProfileEditorModal}
        >
          {t('header.editProfile')}
        </Menu.Item>
        <Menu.Item
          icon={
            <Icon size="xs">
              <ColorPaletteIcon />
            </Icon>
          }
          onClick={toggleThemeEditorModal}
        >
          {t('header.customizeTheme')}
        </Menu.Item>
      </Menu>
      <ThemeEditorModal />
      <ProfileEditorModal />
    </>
  );
}
