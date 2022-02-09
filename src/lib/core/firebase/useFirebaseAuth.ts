import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
  Unsubscribe,
  User,
  UserCredential
} from 'firebase/auth';

export function useFirebaseAuth() {
  const auth = getAuth();

  const authenticate: () => Promise<UserCredential> = () => signInAnonymously(auth);

  const subscribeAuth: (callback: (user: User | null) => void) => Unsubscribe = (
    callback: (user: User | null) => void
  ) => {
    return onAuthStateChanged(auth, (firebaseUser) => callback(firebaseUser));
  };

  const signOut: () => Promise<void> = () => firebaseSignOut(auth);

  return { authenticate, subscribeAuth, signOut };
}
