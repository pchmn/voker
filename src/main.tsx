import App from '@app/App';
import { VokerUiProvider } from '@lib/ui';
import firebase from 'firebase/compat/app';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './config/i18n/translation';
import './index.css';

const firebaseConfigProd = {
  apiKey: import.meta.env.VITE_VOKER_API_KEY_PROD,
  authDomain: 'voker-c4ea8.firebaseapp.com',
  databaseURL: 'https://voker-c4ea8-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'voker-c4ea8',
  storageBucket: 'voker-c4ea8.appspot.com',
  messagingSenderId: '309173481875',
  appId: '1:309173481875:web:e6fdf44a7c433265cbb866',
  measurementId: 'G-WDTTGCRGS9'
};
const firebaseConfigDev = {
  apiKey: import.meta.env.VITE_VOKER_API_KEY_DEV,
  authDomain: 'voker-dev.firebaseapp.com',
  databaseURL: 'https://voker-dev-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'voker-dev',
  storageBucket: 'voker-dev.appspot.com',
  messagingSenderId: '483044840910',
  appId: '1:483044840910:web:8e2c4ff5e8718e5c7ac79f'
};
firebase.initializeApp(import.meta.env.PROD ? firebaseConfigProd : firebaseConfigDev);

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <VokerUiProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </VokerUiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
