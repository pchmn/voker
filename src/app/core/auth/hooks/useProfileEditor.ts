import { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from './useCurrentUser';

export function useProfileEditor(onClose: () => void) {
  const { t } = useTranslation();
  const { data, isLoading, setUsername } = useCurrentUser();
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
      await setUsername({ name: inputValue });
    }
    onClose();
  };

  return { t, data, isLoading, inputValue, setInputValue, onSubmit, inputRef };
}
