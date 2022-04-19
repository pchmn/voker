import { Button, Group, TextInput } from '@mantine/core';
import React from 'react';
import { useProfileEditor } from '../hooks/useProfileEditor';

interface ProfileEditorProps {
  onClose?: () => void;
  showLabel?: boolean;
  direction?: 'row' | 'column';
}

export function ProfileEditor({ onClose, showLabel = true, direction = 'column' }: ProfileEditorProps) {
  const { inputRef, inputValue, setInputValue, onSubmit, t, isLoading } = useProfileEditor(onClose);

  return (
    <form onSubmit={onSubmit}>
      <Group direction={direction} grow={direction === 'column'}>
        <TextInput
          ref={inputRef}
          label={showLabel && t('header.profileEditor.name')}
          placeholder={t('header.profileEditor.namePlaceholder')}
          required
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          disabled={isLoading}
          style={{ flex: 1 }}
          variant="default"
        />

        <Button type="submit" disabled={isLoading || !inputValue}>
          {t('common.validate')}
        </Button>
      </Group>
    </form>
  );
}
