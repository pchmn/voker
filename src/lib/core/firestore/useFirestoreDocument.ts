import { DeepPartial, FirestoreDocument, UpdateOptions, useFirestore } from '@lib/core';
import { Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';

interface Options {
  listen?: boolean;
}

export function useFirestoreDocument<T>(path: string, options: Options = { listen: true }) {
  const { getDoc, subscribeDoc, setDoc, updateDoc, deleteDoc } = useFirestore<T>();
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const { data, isLoading, isFetching, error } = useQuery<FirestoreDocument<T> | undefined, Error>(
    path,
    async () => {
      if (options.listen) {
        let resolved = false;

        return new Promise<FirestoreDocument<T> | undefined>((resolve, reject) => {
          unsubscribe.current = subscribeDoc(
            { path },
            (val) => {
              if (!resolved) {
                resolved = true;
                return resolve(val);
              }
              queryClient.setQueryData<FirestoreDocument<T> | undefined>(path, val);
            },
            reject
          );
        });
      }
      console.log('getDoc', path);
      return getDoc({ path });
    },
    { staleTime: options.listen ? Infinity : 0 }
  );

  const set: (value: T) => Promise<void> = (value) => setDoc({ path, value });

  const update: (value: DeepPartial<T>, options?: UpdateOptions) => Promise<void> = (value, options) =>
    updateDoc({ path, value, options });

  const remove: () => Promise<void> = () => deleteDoc({ path });

  return { data, isLoading: isLoading || isFetching, error, set, update, remove };
}
