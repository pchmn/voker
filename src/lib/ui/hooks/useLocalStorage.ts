// eslint-disable-next-line no-restricted-imports
import { HTML5Store, StorageChangeEvent, StorageType } from '@lib/ui/hooks/storage';
import { useEffect, useMemo, useState } from 'react';

interface Options<T> {
  key: string;
  defaultValue?: T;
  storage?: StorageType;
}

export function useStorage<T>({
  key,
  defaultValue,
  storage
}: Options<T>): [T | undefined, (value: T) => void, () => void] {
  const store = useMemo(() => new HTML5Store<T>(storage), [storage]);
  const [value, setValue] = useState(store.get(key, defaultValue));

  useEffect(() => {
    const listener = ((event: StorageChangeEvent<T>) => {
      if (event.detail.value !== value) {
        setValue(event.detail.value);
      }
    }) as EventListener;
    store.watch(key, listener);

    return () => {
      store.unwatch(key);
    };
  }, [key, store, value]);

  const set = (value: T) => store.set(key, value);

  const remove = () => store.remove(key);

  return [value, set, remove];
}
