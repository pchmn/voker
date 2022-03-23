import { convertObjectToDotNotation, DeepPartial, FirestoreDocument } from '@lib/core';
import {
  addDoc as firestoreAddDoc,
  collection,
  deleteDoc as firestoreDeleteDoc,
  doc,
  DocumentSnapshot,
  FieldPath,
  FirestoreError,
  getDoc as firestoreGetDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy as firestoreOrberBy,
  OrderByDirection,
  query as firestoreQuery,
  QueryConstraint,
  setDoc as firestoreSetDoc,
  Unsubscribe,
  UpdateData,
  updateDoc as firestoreUpdateDoc,
  where as firestoreWhere,
  WhereFilterOp
} from 'firebase/firestore';
import { useMemo } from 'react';

export interface UpdateOptions {
  overwrite: boolean;
}

interface BaseParams {
  path: string;
}

interface SetParams<T> extends BaseParams {
  value: T;
}

interface UpdateParams<T> extends BaseParams {
  value: DeepPartial<T>;
  options?: UpdateOptions;
}

interface AddParams<T> extends SetParams<T> {
  id?: string;
}

type Where = [fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown];
type OrderBy = [fieldPath: string | FieldPath, directionStr: OrderByDirection];
export interface QueryOptions {
  where?: Where | Where[];
  orderBy?: string | OrderBy | OrderBy[];
}

interface ReadCollectionParams extends BaseParams {
  query?: QueryOptions;
}

export function useFirestore<T>() {
  const db = useMemo(() => getFirestore(), []);

  const getDoc: (params: BaseParams) => Promise<FirestoreDocument<T> | undefined> = async ({ path }) =>
    castSnapshotToFirestoreDocument<T>(await firestoreGetDoc(doc(db, path)));

  const subscribeDoc: (
    params: BaseParams,
    onValue: (value: FirestoreDocument<T> | undefined) => void,
    onError?: (error: FirestoreError) => void
  ) => Unsubscribe = ({ path }, onValue, onError) => {
    return onSnapshot(
      doc(db, path),
      (docSnap) => onValue(castSnapshotToFirestoreDocument<T>(docSnap)),
      (error) => onError?.(error)
    );
  };

  const setDoc: (prams: SetParams<T>) => Promise<void> = ({ path, value }) => firestoreSetDoc(doc(db, path), value);

  const updateDoc: (params: UpdateParams<T>) => Promise<void> = ({ path, value, options = { overwrite: false } }) =>
    firestoreUpdateDoc(
      doc(db, path),
      options.overwrite ? (value as UpdateData<T>) : (convertObjectToDotNotation<T>(value) as UpdateData<T>)
    );

  const deleteDoc: (params: BaseParams) => Promise<void> = ({ path }) => firestoreDeleteDoc(doc(db, path));

  const addDoc: (params: AddParams<T>) => Promise<string> = async ({ path, value, id }) => {
    if (id) {
      const docRef = doc(db, path, id);
      await firestoreSetDoc(docRef, value);
      return docRef.id;
    }
    return (await firestoreAddDoc(collection(db, path), value)).id;
  };

  const getCollection: (params: ReadCollectionParams) => Promise<FirestoreDocument<T>[] | undefined> = async ({
    path,
    query = { where: undefined, orderBy: undefined }
  }) => {
    const q = firestoreQuery(
      collection(db, path),
      ...createWhereQuery(query.where).concat(createOrderByQuery(query.orderBy))
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return undefined;
    }

    const data: FirestoreDocument<T>[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as FirestoreDocument<T>);
    });
    return data;
  };

  const subscribeCollection: (
    params: ReadCollectionParams,
    onValue: (value: FirestoreDocument<T>[] | undefined) => void,
    onError?: (error: FirestoreError) => void
  ) => Unsubscribe = ({ path, query = { where: undefined, orderBy: undefined } }, onValue, onError) => {
    const q = firestoreQuery(
      collection(db, path),
      ...createWhereQuery(query.where).concat(createOrderByQuery(query.orderBy))
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          onValue(undefined);
        } else {
          const data: FirestoreDocument<T>[] = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as FirestoreDocument<T>);
          });
          onValue(data);
        }
      },
      (error) => onError?.(error)
    );
  };

  return { getDoc, subscribeDoc, setDoc, updateDoc, deleteDoc, addDoc, getCollection, subscribeCollection };
}

function castSnapshotToFirestoreDocument<T>(docSnap: DocumentSnapshot): FirestoreDocument<T> | undefined {
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as FirestoreDocument<T>) : undefined;
}

function createWhereQuery(where?: Where | Where[]): QueryConstraint[] {
  if (!where) {
    return [];
  }
  if (Array.isArray(where)) {
    const queryConstraint = [];
    for (const query of where) {
      queryConstraint.push(firestoreWhere((query as Where)[0], (query as Where)[1], (query as Where)[2]));
    }
    return queryConstraint;
  }
  return [firestoreWhere(where[0], where[1], where[2])];
}

function createOrderByQuery(orderBy?: string | OrderBy | OrderBy[]): QueryConstraint[] {
  if (!orderBy) {
    return [];
  }
  if (Array.isArray(orderBy)) {
    const queryConstraint = [];
    for (const query of orderBy) {
      queryConstraint.push(firestoreOrberBy((query as OrderBy)[0], (query as OrderBy)[1]));
    }
    return queryConstraint;
  }
  if (typeof orderBy === 'string') {
    return [firestoreOrberBy(orderBy)];
  }
  return [firestoreOrberBy(orderBy[0], orderBy[1])];
}
