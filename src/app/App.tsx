import { withAuth } from '@app/core/auth';
import { AppLayout } from '@app/core/layout';
import { Home } from '@app/modules/home';
import { AnimatedRoute } from '@lib/ui';
import { Outlet, ReactLocation, Router } from '@tanstack/react-location';
import React from 'react';
import './App.css';
import { roomRoutes } from './modules/room';

const location = new ReactLocation();

function App() {
  return (
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
        },
        roomRoutes
      ]}
    >
      <AppLayout>
        <Outlet />
      </AppLayout>
    </Router>
  );
}

export default withAuth(App);
