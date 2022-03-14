import { Button, ModalProps, Space, TextInput } from '@mantine/core';
import React from 'react';
import { useProfileEditor } from '../hooks/useProfileEditor';

export function ProfileEditor({ onClose }: Pick<ModalProps, 'onClose'>) {
  const { inputRef, inputValue, setInputValue, onSubmit, t, isLoading } = useProfileEditor(onClose);

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        ref={inputRef}
        label={t('header.profileEditor.name')}
        placeholder={t('header.profileEditor.namePlaceholder')}
        required
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        disabled={isLoading}
      />

      <Space h="lg" />
      <Button type="submit" fullWidth disabled={isLoading || !inputValue}>
        {t('common.validate')}
      </Button>
    </form>
  );
}
