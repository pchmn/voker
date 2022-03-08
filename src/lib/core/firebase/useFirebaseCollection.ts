import { FirebaseDocument, useFirebase } from '@lib/core';
import { Unsubscribe } from 'firebase/database';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';

interface Options {
  listen?: boolean;
}

export function useFirebaseCollection<T extends FirebaseDocument>(path: string, { listen = true }: Options) {
  const { getCollection, subscribeCollection, set, generateNewChild } = useFirebase<T>();
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const queryResult = useQuery<T[] | null, Error>(path, async () => {
    if (listen) {
      const resolved = false;

      return new Promise<T[] | null>((resolve, reject) => {
        unsubscribe.current = subscribeCollection(
          {
            path
          },
          (val) => {
            if (!resolved) {
              return resolve(val);
            }
            queryClient.setQueryData<T[] | null>(path, val);
          },
          reject
        );
      });
    }

    return getCollection({ path });
  });

  const add: (params: { value: T; key?: string }) => Promise<void> = ({ value, key }) => {
    return set({ path: generateNewChild({ path, key }), value });
  };

  return { queryResult, add };
}
