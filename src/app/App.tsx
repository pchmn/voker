import { AppLayout } from '@app/components';
import { useFirebaseAuth } from '@lib/core';
import React, { useEffect } from 'react';
import './App.css';

function App() {
  const { authenticate } = useFirebaseAuth();

  useEffect(() => {
    (async function anyNameFunction() {
      console.log(await authenticate());
    })();
  }, [authenticate]);

  return <AppLayout />;
}

export default App;
