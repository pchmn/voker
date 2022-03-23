import { DeepPartial, FirestoreDocument, QueryOptions, useFirestore } from '@lib/core';
import { Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Options } from '../models/options.model';

interface CollectionOptions extends Options {
  query?: QueryOptions;
}

export function useFirestoreCollection<T>(
  path: string,
  { listen = true, query = { where: undefined, orderBy: undefined } }: CollectionOptions
) {
  const { getCollection, subscribeCollection, addDoc, updateDoc, deleteDoc } = useFirestore<T>();
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const queryResult = useQuery<FirestoreDocument<T>[] | undefined, Error>(path, async () => {
    if (listen) {
      const resolved = false;

      return new Promise<FirestoreDocument<T>[] | undefined>((resolve, reject) => {
        unsubscribe.current = subscribeCollection(
          { path, query },
          (val) => {
            if (!resolved) {
              return resolve(val);
            }
            queryClient.setQueryData<FirestoreDocument<T>[] | undefined>(path, val);
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
