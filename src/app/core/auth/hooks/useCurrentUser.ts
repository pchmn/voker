import { Options, useFirebaseAuth, useFirestoreDocument } from '@lib/core';

export function useCurrentUser(options: Options = { listen: false }) {
  const { currentUser } = useFirebaseAuth();
  const { data, isLoading, set } = useFirestoreDocument<{ name: string }>(`users/${currentUser?.uid}`, options);

  return { data, isLoading, setUsername: set };
}
