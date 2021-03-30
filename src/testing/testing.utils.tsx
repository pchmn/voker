import store from '@core/store/store';
import { matchers } from '@emotion/jest';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import * as theme from './theme.json';

expect.extend(matchers);

jest.mock('@material-ui/core/styles/useTheme', () => theme);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

export const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}): RenderResult<any> => {
  window.history.pushState({}, 'Test page', route);
  return render(<Provider store={store}>{ui}</Provider>, { wrapper: BrowserRouter });
};

export const renderWithStore = (ui: React.ReactElement): RenderResult => {
  return render(<Provider store={store}>{ui}</Provider>);
};
