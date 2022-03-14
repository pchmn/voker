import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
  Unsubscribe,
  User,
  UserCredential
} from 'firebase/auth';
import { useEffect, useRef } from 'react';

export function useFirebaseAuth() {
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const auth = getAuth();

  const authenticate: () => Promise<UserCredential> = () => signInAnonymously(auth);

  const getCurrentUser: () => User | null = () => auth.currentUser;

  const subscribeAuth: (callback: (user: User | null) => void) => Unsubscribe = (
    callback: (user: User | null) => void
  ) => {
    const onAuth = onAuthStateChanged(auth, (firebaseUser) => callback(firebaseUser));
    unsubscribe.current = onAuth;
    return onAuth;
  };

  const signOut: () => Promise<void> = () => firebaseSignOut(auth);

  return { authenticate, getCurrentUser, subscribeAuth, signOut };
}
