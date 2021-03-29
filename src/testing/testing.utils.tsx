import { matchers } from '@emotion/jest';
import { render, RenderResult } from '@testing-library/react';
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
  return render(ui, { wrapper: BrowserRouter });
};
