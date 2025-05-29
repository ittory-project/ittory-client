import Hotjar from '@hotjar/browser';
import * as Sentry from '@sentry/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.tsx';
import { accessTokenRepository } from './api/config/AccessTokenRepository.ts';
import { persistor, store } from './api/config/state.ts';
import './index.css';
import { ReactQueryClientProvider } from './react-query-provider.tsx';
import {
  activateDefaultLog,
  attachLoggerOnError,
  attachLoggerOnNavigate,
  logBrowserInformation,
} from './utils/SessionLogger';

const {
  VITE_DEPLOY_ENV,
  VITE_SENTRY_DSN,
  VITE_HOTJAR_SITE_ID,
  VITE_HOTJAR_VERSION,
} = import.meta.env;

if (VITE_DEPLOY_ENV !== 'prod') {
  activateDefaultLog();
  attachLoggerOnNavigate();
  attachLoggerOnError();
  logBrowserInformation();
} else {
  const siteId = Number(VITE_HOTJAR_SITE_ID);
  const version = Number(VITE_HOTJAR_VERSION);
  Hotjar.init(siteId, version);
}

Sentry.init({
  dsn: VITE_SENTRY_DSN,
  integrations: [Sentry.captureConsoleIntegration({ levels: ['error'] })],
});

// TODO: 로그인 로딩에 대한 더 좋은 방식 찾기.
accessTokenRepository.refresh().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <ReactQueryClientProvider>
            <App />
            <ReactQueryDevtools position="right" initialIsOpen={false} />
          </ReactQueryClientProvider>
        </HelmetProvider>
      </PersistGate>
    </Provider>,
  );
});
