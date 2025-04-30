import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.tsx';
import { accessTokenRepository } from './api/config/AccessTokenRepository.ts';
import { persistor, store } from './api/config/state.ts';
import './index.css';
import {
  activateDefaultLog,
  attachLoggerOnError,
  attachLoggerOnNavigate,
  logBrowserInformation,
} from './utils/SessionLogger';

activateDefaultLog();
attachLoggerOnNavigate();
attachLoggerOnError();
logBrowserInformation();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.captureConsoleIntegration({ levels: ['error'] })],
});

// TODO: 로그인 로딩에 대한 더 좋은 방식 찾기.
accessTokenRepository.refresh().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </PersistGate>
    </Provider>,
  );
});
