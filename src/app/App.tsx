import { withAuth } from '@app/core/auth';
import { AppLayout } from '@app/core/layout';
import { Home } from '@app/modules/Home';
import { AnimatedRoute } from '@lib/ui';
import { ReactLocation, Router } from '@tanstack/react-location';
import React from 'react';
import './App.css';

const location = new ReactLocation();

function App() {
  return (
    <AppLayout>
      <Router
        basepath="/voker"
        location={location}
        key={location.current.pathname}
        routes={[
          {
            path: '/',
            element: (
              <AnimatedRoute>
                <Home />
              </AnimatedRoute>
            )
          }
        ]}
      ></Router>
    </AppLayout>
  );
}

export default withAuth(App);
