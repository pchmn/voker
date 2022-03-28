import { withAuth } from '@app/core/auth';
import { AppLayout } from '@app/core/layout';
import { Home } from '@app/modules/Home';
import { ReactLocation, Router } from '@tanstack/react-location';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import './App.css';

const location = new ReactLocation();

function App() {
  return (
    <AppLayout>
      <Router
        basepath="/voker"
        location={location}
        routes={[
          {
            path: '/',
            element: (
              <AnimatePresence>
                <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Home />
                </motion.div>
              </AnimatePresence>
            )
          }
        ]}
      ></Router>
    </AppLayout>
  );
}

export default withAuth(App);
