import { Home } from '@features/Home/Home';
import { AnimateRoute, AnimateSwitch } from 'la-danze-ui';
import React from 'react';

function App(): JSX.Element {
  return (
    <AnimateSwitch fullHeight animationType="scale">
      <AnimateRoute exact path="/">
        <Home />
      </AnimateRoute>
    </AnimateSwitch>
  );
}

export default App;
