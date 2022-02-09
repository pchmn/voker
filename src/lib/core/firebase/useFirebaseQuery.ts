import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { FirebaseEvent, useFirebase } from 'src/lib/core/firebase/useFirebase';

export function useFirebaseQuery<T>(firebasePathKey: string, event?: FirebaseEvent) {
  const { subscribe } = useFirebase<T>();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribe({
      path: firebasePathKey,
      event,
      callback: (val) => {
        queryClient.setQueryData(firebasePathKey, val);
      }
    });

    return () => unsubscribe();
  }, [event, firebasePathKey, queryClient, subscribe]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return useQuery<T, Error>(firebasePathKey, () => new Promise<T>(() => {}));
}
