import { withAuth } from '@app/core/auth';
import { AppLayout } from '@app/core/layout';
import { Home } from '@app/features/Home';
import React from 'react';
import './App.css';

function App() {
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

export default withAuth(App);
