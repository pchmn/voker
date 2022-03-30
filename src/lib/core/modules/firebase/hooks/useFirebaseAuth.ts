import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
  Unsubscribe,
  User,
  UserCredential
} from 'firebase/auth';
import { useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Options } from '../models/options.model';

export function useFirebaseAuth(options: Options = { listen: true }) {
  const unsubscribe = useRef<Unsubscribe>();
  const queryClient = useQueryClient();
  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const { data, isLoading, isFetching, error } = useQuery<User | null, Error>(
    'firebaseAuth',
    async () => {
      if (options.listen) {
        let resolved = false;

        return new Promise<User | null>((resolve, reject) => {
          unsubscribe.current = onAuthStateChanged(
            auth,
            (firebaseUser) => {
              if (!resolved) {
                resolved = true;
                return resolve(firebaseUser);
              }
              queryClient.setQueryData<User | null>('firebaseAuth', firebaseUser);
            },
            reject
          );
        });
      }

      return auth.currentUser;
    },
    { staleTime: options.listen ? Infinity : 0 }
  );

  const signIn: () => Promise<UserCredential> = () => signInAnonymously(auth);

  const signOut: () => Promise<void> = () => firebaseSignOut(auth);

  return { currentUser: data, isLoading: isLoading || isFetching, error, signIn, signOut };
}
