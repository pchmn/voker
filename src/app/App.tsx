import { AppLayout } from '@app/core/layout';
import { Home } from '@app/features/Home';
import { useFirebaseAuth } from '@lib/core';
import React, { useEffect } from 'react';
import './App.css';

function App() {
  const { authenticate, getCurrentUser } = useFirebaseAuth();

  useEffect(() => {
    (async function anyNameFunction() {
      await authenticate();
      console.log('getCurrentUser', getCurrentUser());
    })();
  }, [authenticate, getCurrentUser]);

  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

export default App;
