import '@config/i18n/translation';
import { Theme } from 'la-danze-ui';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Theme>
        <App />
      </Theme>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
