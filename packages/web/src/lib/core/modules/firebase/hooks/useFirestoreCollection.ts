import { convertObjectToDotNotation, DeepPartial } from '@lib/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  UpdateData,
  updateDoc
} from 'firebase/firestore';
import { useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { createOrderByQuery, createWhereQuery, FirestoreDocument, OrderBy, Where } from '..';
import { Options } from '../models/options.model';

interface QueryOptions {
  where?: Where | Where[];
  orderBy?: string | OrderBy | OrderBy[];
}
interface CollectionOptions extends Options {
  queryOptions?: QueryOptions;
}

export function useFirestoreCollection<T>(
  path: string,
  { listen = true, queryOptions = { where: undefined, orderBy: undefined } }: CollectionOptions
) {
  const db = useMemo(() => getFirestore(), []);
  const collectionRef = useMemo(() => collection(db, path), [db, path]);
  const q = useMemo(
    () =>
      query(collectionRef, ...createWhereQuery(queryOptions.where).concat(createOrderByQuery(queryOptions.orderBy))),
    [collectionRef, queryOptions]
  );
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const { data, isLoading, isFetching, error } = useQuery<FirestoreDocument<T>[] | undefined, Error>(path, async () => {
    if (listen) {
      const resolved = false;

      return new Promise<FirestoreDocument<T>[] | undefined>((resolve, reject) => {
        unsubscribe.current = onSnapshot(
          q,
          (querySnapshot) => {
            let value: FirestoreDocument<T>[] | undefined;
            if (!querySnapshot.empty) {
              value = [];
              querySnapshot.forEach((doc) => {
                value?.push({ id: doc.id, ...doc.data() } as FirestoreDocument<T>);
              });
              if (!resolved) {
                return resolve(value);
              }
              queryClient.setQueryData<FirestoreDocument<T>[] | undefined>(path, value);
            }
          },
          reject
        );
      });
    }

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return undefined;
    }

    const value: FirestoreDocument<T>[] = [];
    querySnapshot.forEach((doc) => {
      value.push({ id: doc.id, ...doc.data() } as FirestoreDocument<T>);
    });
    return value;
  });

  const add: (value: T, id?: string) => Promise<string> = async (value, id) => {
    if (id) {
      const docRef = doc(db, path, id);
      await setDoc(docRef, value);
      return docRef.id;
    }
    return (await addDoc(collectionRef, value)).id;
  };

  const update: (id: string, value: DeepPartial<T>, options?: { overwrite: boolean }) => Promise<void> = (
    id,
    value,
    options = { overwrite: false }
  ) =>
    updateDoc(
      doc(db, path, id),
      options.overwrite ? (value as UpdateData<T>) : (convertObjectToDotNotation<T>(value) as UpdateData<T>)
    );

  const remove: (id: string) => Promise<void> = (id) => deleteDoc(doc(db, path, id));

  return { data, isLoading: isLoading || isFetching, error, add, update, remove };
}
