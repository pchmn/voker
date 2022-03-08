import { FirebaseDocument } from '@lib/core';
import {
  child,
  DataSnapshot,
  get,
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  push,
  ref,
  remove as firebaseRemove,
  set as firebaseSet,
  ThenableReference,
  Unsubscribe,
  update as firebaseUpdate
} from 'firebase/database';

interface FirebaseBaseParams {
  path: string;
}

export type FirebaseEvent = 'value' | 'childAdded' | 'childChanged' | 'childRemoved';

interface FirebaseSubscribeParams extends FirebaseBaseParams {
  event?: FirebaseEvent;
}

interface FirebaseWriteParams {
  path: string | ThenableReference;
  value: unknown;
}

interface FirebaseUpdateParams {
  updates: { [key: string]: unknown };
}

interface FirebasePushParams extends FirebaseBaseParams {
  key?: unknown;
}

export function useFirebase<T extends FirebaseDocument>() {
  const db = getDatabase();
  const dbRef = ref(db);

  const getDocument: (params: FirebaseBaseParams) => Promise<T | null> = async ({ path }) => {
    const snapshot = await get(child(dbRef, path));
    return snapshot.exists() ? castToFirebaseDocument<T>(snapshot) : null;
  };

  const getCollection: (params: FirebaseBaseParams) => Promise<T[] | null> = async ({ path }) => {
    const snapshot = await get(child(dbRef, path));
    if (!snapshot.hasChildren()) {
      if (snapshot.val()) {
        throw new Error('Data is not a collection');
      }
      return null;
    } else {
      const data: T[] = [];
      snapshot.forEach((child) => {
        data.push(castToFirebaseDocument<T>(child));
      });
      return data;
    }
  };

  const subscribe: (
    params: FirebaseSubscribeParams,
    callback: (value: T | null) => void,
    errorCallback?: (error: Error) => void
  ) => Unsubscribe = ({ path, event = 'value' }, callback, errorCallback) => {
    const subscribeRef = ref(db, path);

    switch (event) {
      case 'value':
        return onValue(
          subscribeRef,
          (snapshot) => {
            callback(snapshot.exists() ? castToFirebaseDocument<T>(snapshot) : null);
          },
          (error) => errorCallback?.(error)
        );
      case 'childAdded':
        return onChildAdded(
          subscribeRef,
          (snapshot) => {
            callback(snapshot.val() as T);
          },
          (error) => errorCallback?.(error)
        );
      case 'childChanged':
        return onChildChanged(
          subscribeRef,
          (snapshot) => {
            callback(snapshot.val() as T);
          },
          (error) => errorCallback?.(error)
        );
      case 'childRemoved':
        return onChildRemoved(
          subscribeRef,
          (snapshot) => {
            callback(snapshot.val() as T);
          },
          (error) => errorCallback?.(error)
        );
    }
  };

  const subscribeCollection: (
    params: FirebaseBaseParams,
    callback: (value: T[] | null) => void,
    errorCallback?: (error: Error) => void
  ) => Unsubscribe = ({ path }, callback, errorCallback) => {
    const subscribeRef = ref(db, path);

    return onValue(
      subscribeRef,
      (snapshot) => {
        if (!snapshot.hasChildren()) {
          snapshot.val() === null ? callback(null) : errorCallback?.(new Error('Data is not a collection'));
        } else {
          const data: T[] = [];
          snapshot.forEach((child) => {
            data.push(castToFirebaseDocument<T>(child));
          });
          callback(data);
        }
      },
      (error) => errorCallback?.(error)
    );
  };

  const set: (params: FirebaseWriteParams) => Promise<void> = ({ path, value }) => {
    return firebaseSet(typeof path === 'string' ? ref(db, path) : path, value);
  };

  const updateMany: (params: FirebaseUpdateParams) => Promise<void> = ({ updates }) => {
    return firebaseUpdate(dbRef, updates);
  };

  const update: (params: FirebaseWriteParams) => Promise<void> = ({ value }) => {
    return firebaseUpdate(dbRef, value as Partial<T>);
  };

  const remove: (params: FirebaseBaseParams) => Promise<void> = ({ path }) => {
    return firebaseRemove(ref(db, path));
  };

  const generateNewChild: (params: FirebasePushParams) => ThenableReference = ({ path, key }) => {
    return push(ref(db, path), key);
  };

  return {
    getDocument,
    getCollection,
    subscribe,
    subscribeCollection,
    set,
    update,
    updateMany,
    remove,
    generateNewChild
  };
}

function castToFirebaseDocument<T extends FirebaseDocument>(snapshot: DataSnapshot): T {
  return { key: snapshot.key, ...snapshot.val() };
}
