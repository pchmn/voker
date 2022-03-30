import { convertObjectToDotNotation, DeepPartial, FirestoreDocument } from '@lib/core';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  Unsubscribe,
  UpdateData,
  updateDoc
} from 'firebase/firestore';
import { useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { castSnapshotToFirestoreDocument, Options } from '..';

export function useFirestoreDocument<T>(path: string, options: Options = { listen: true }) {
  const docRef = useMemo(() => doc(getFirestore(), path), [path]);
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
          unsubscribe.current = onSnapshot(
            docRef,
            (docSnap) => {
              const value = castSnapshotToFirestoreDocument<T>(docSnap);
              if (!resolved) {
                resolved = true;
                return resolve(value);
              }
              queryClient.setQueryData<FirestoreDocument<T> | undefined>(path, value);
            },
            reject
          );
        });
      }
      return castSnapshotToFirestoreDocument<T>(await getDoc(docRef));
    },
    { staleTime: options.listen ? Infinity : 0 }
  );

  const set: (value: T) => Promise<void> = (value) => setDoc(docRef, value);

  const update: (value: DeepPartial<T>, options?: { overwrite: boolean }) => Promise<void> = (
    value,
    options = { overwrite: false }
  ) =>
    updateDoc(
      docRef,
      options.overwrite ? (value as UpdateData<T>) : (convertObjectToDotNotation<T>(value) as UpdateData<T>)
    );

  const remove: () => Promise<void> = () => deleteDoc(docRef);

  return { data, isLoading: isLoading || isFetching, error, set, update, remove };
}
