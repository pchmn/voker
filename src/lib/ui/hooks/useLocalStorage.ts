// eslint-disable-next-line no-restricted-imports
import { HTML5Store, StorageChangeEvent, StorageType } from '@lib/ui/hooks/storage';
import { useEffect, useMemo, useState } from 'react';

interface Options<T> {
  key: string;
  defaultValue?: T;
  storage?: StorageType;
}

export function useStorage<T>(options: Options<T>): [T | undefined, (value: T) => void, () => void] {
  const store = useMemo(() => new HTML5Store<T>(options.storage), [options]);
  const [value, setValue] = useState(store.get(options.key, options.defaultValue));

  useEffect(() => {
    const listener = ((event: StorageChangeEvent<T>) => {
      console.log('event');
      if (event.detail.value !== value) {
        setValue(event.detail.value);
      }
    }) as EventListener;
    store.watch(options.key, listener);

    return () => {
      store.unwatch(options.key);
    };
  }, [options, store, value]);

  const set = (value: T) => store.set(options.key, value);

  const remove = () => store.remove(options.key);

  return [value, set, remove];
}
