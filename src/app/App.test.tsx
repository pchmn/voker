import { waitFor } from '@testing-library/react';
import { renderWithRouter } from '@testing/testing.utils';
import React from 'react';
import { App } from 'src/app/App';

describe('<App>', () => {
  test('It should render app', async () => {
    const app = renderWithRouter(<App />);

    await waitFor(() => expect(app).toBeDefined());
  });
});
