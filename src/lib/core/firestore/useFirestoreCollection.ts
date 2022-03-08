import { DeepPartial, FirestoreDocument, QueryOptions, useFirestore } from '@lib/core';
import { Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';

interface Options {
  listen?: boolean;
  query?: QueryOptions;
}

export function useFirestoreCollection<T extends FirestoreDocument>(
  path: string,
  { listen = true, query = { where: undefined, orderBy: undefined } }: Options
) {
  const { getCollection, subscribeCollection, addDoc, updateDoc, deleteDoc } = useFirestore<T>();
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const queryResult = useQuery<T[] | undefined, Error>(path, async () => {
    if (listen) {
      const resolved = false;

      return new Promise<T[] | undefined>((resolve, reject) => {
        unsubscribe.current = subscribeCollection(
          { path, query },
          (val) => {
            if (!resolved) {
              return resolve(val);
            }
            queryClient.setQueryData<T[] | undefined>(path, val);
          },
          reject
        );
      });
    }

    return getCollection({ path, query });
  });

  const add: (value: T) => Promise<string> = (value) => addDoc({ path, value });

  const update: (id: string, value: DeepPartial<T>) => Promise<void> = (id, value) =>
    updateDoc({ path: `${path}/${id}`, value });

  const remove: (id: string) => Promise<void> = (id) => deleteDoc({ path: `${path}/${id}` });

  return { queryResult, add, update, remove };
}
