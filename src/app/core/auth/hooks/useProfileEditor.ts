import { useFirebaseAuth, useFirestoreDocument } from '@lib/core';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useProfileEditor(onClose: () => void) {
  const { t } = useTranslation();
  const { getCurrentUser } = useFirebaseAuth();
  const { data, isLoading, set } = useFirestoreDocument<{ name: string }>(`users/${getCurrentUser()?.uid}`, {
    listen: false
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(data?.name || '');
  }, [data]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue && inputValue !== data?.name) {
      await set({ name: inputValue });
    }
    onClose();
  };

  return { t, data, isLoading, set, inputValue, setInputValue, onSubmit, inputRef };
}
