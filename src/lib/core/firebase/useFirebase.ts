import {
  child,
  get,
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  push,
  ref,
  set,
  ThenableReference,
  Unsubscribe,
  update as firebaseUpdate
} from 'firebase/database';

interface FirebaseFetchParams {
  path: string;
}

export type FirebaseEvent = 'value' | 'childAdded' | 'childChanged' | 'childRemoved';

interface FirebaseSubscribeParams<T> {
  path: string;
  event?: FirebaseEvent;
  callback: (value: T) => void;
}

interface FirebaseWriteParams {
  path: string;
  value: unknown;
}

interface FirebaseUpdateParams {
  updates: { [key: string]: unknown };
}

interface FirebasePushParams {
  path: string;
  key?: unknown;
}

export function useFirebase<T>() {
  const db = getDatabase();
  const dbRef = ref(db);

  const fetchOnce: (params: FirebaseFetchParams) => Promise<T> = async ({ path }) => {
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return snapshot.val() as T;
    }
    throw new Error('No data available');
  };

  const subscribe: (params: FirebaseSubscribeParams<T>) => Unsubscribe = ({
    path,
    event = 'value',
    callback
  }: FirebaseSubscribeParams<T>) => {
    const subscribeRef = ref(db, path);

    switch (event) {
      case 'value':
        return onValue(subscribeRef, (snapshot) => {
          callback(snapshot.val() as T);
        });
      case 'childAdded':
        return onChildAdded(subscribeRef, (snapshot) => {
          callback(snapshot.val() as T);
        });
      case 'childChanged':
        return onChildChanged(subscribeRef, (snapshot) => {
          callback(snapshot.val() as T);
        });
      case 'childRemoved':
        return onChildRemoved(subscribeRef, (snapshot) => {
          callback(snapshot.val() as T);
        });
    }
  };

  const write: (params: FirebaseWriteParams) => Promise<void> = ({ path, value }) => {
    return set(ref(db, path), value);
  };

  const update: (params: FirebaseUpdateParams) => Promise<void> = ({ updates }) => {
    return firebaseUpdate(dbRef, updates);
  };

  const generateNewChild: (params: FirebasePushParams) => ThenableReference = ({ path, key }) => {
    return push(ref(db, path), key);
  };

  return { fetchOnce, subscribe, write, update, generateNewChild };
}
