import { FirebaseDocument, useFirebase } from '@lib/core';
import { Unsubscribe } from 'firebase/database';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';

interface Options {
  listen?: boolean;
}

export function useFirebaseDocument<T extends FirebaseDocument>(path: string, { listen = true }: Options) {
  const { getDocument, subscribe, set, update, remove } = useFirebase<T>();
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const queryResult = useQuery<T | null, Error>(path, async () => {
    if (listen) {
      const resolved = false;

      return new Promise<T | null>((resolve, reject) => {
        unsubscribe.current = subscribe(
          {
            path,
            event: 'value'
          },
          (val) => {
            if (!resolved) {
              return resolve(val);
            }
            queryClient.setQueryData<T | null>(path, val);
          },
          reject
        );
      });
    }

    return getDocument({ path });
  });

  const setDocument: (value: T) => Promise<void> = (value) => {
    return set({ path, value });
  };

  const updateDocument: (value: Partial<T>) => Promise<void> = (value) => {
    return update({ path, value });
  };

  const removeDocument: () => Promise<void> = () => {
    return remove({ path });
  };

  return {
    queryResult,
    set: setDocument,
    update: updateDocument,
    remove: removeDocument,
    unsubscribe: unsubscribe.current
  };
}
