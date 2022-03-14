import { useFirebaseAuth } from '@lib/core';
import { useEffect } from 'react';

export function AuthProvider() {
  const { authenticate } = useFirebaseAuth();

  useEffect(() => {
    (async function auth() {
      await authenticate();
    })();
  }, [authenticate]);
}
