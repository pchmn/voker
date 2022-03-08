import { DeepPartial, FirestoreDocument, UpdateOptions, useFirestore } from '@lib/core';
import { Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';

interface Options {
  listen?: boolean;
}

export function useFirestoreDocument<T extends FirestoreDocument>(path: string, { listen = true }: Options) {
  const { getDoc, subscribeDoc, setDoc, updateDoc, deleteDoc } = useFirestore<T>();
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const queryResult = useQuery<T | undefined, Error>(path, async () => {
    if (listen) {
      const resolved = false;

      return new Promise<T | undefined>((resolve, reject) => {
        unsubscribe.current = subscribeDoc(
          { path },
          (val) => {
            if (!resolved) {
              return resolve(val);
            }
            queryClient.setQueryData<T | undefined>(path, val);
          },
          reject
        );
      });
    }

    return getDoc({ path });
  });

  const set: (value: T) => Promise<void> = (value) => setDoc({ path, value });

  const update: (value: DeepPartial<T>, options?: UpdateOptions) => Promise<void> = (value, options) =>
    updateDoc({ path, value, options });

  const remove: () => Promise<void> = () => deleteDoc({ path });

  return { queryResult, set, update, remove };
}
