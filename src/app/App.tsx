import { AppLayout } from '@app/components';
import { Home } from '@app/features/Home';
import { useFirebaseAuth } from '@lib/core';
import React, { useEffect } from 'react';
import './App.css';

function App() {
  const { authenticate, currentUser } = useFirebaseAuth();

  useEffect(() => {
    console.log('in');
    // (async function anyNameFunction() {
    //   await authenticate();
    //   console.log(currentUser());
    // })();
  }, [authenticate, currentUser]);

  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

export default App;
