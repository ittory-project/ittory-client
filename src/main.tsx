import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './api/config/state.ts';
import { HelmetProvider } from 'react-helmet-async';
import { accessTokenRepository } from './api/config/AccessTokenRepository.ts';

import * as Sentry from '@sentry/react';
import { attachLoggerOnNavigate } from './utils/attachLoggerOnNavigate.ts';
import { activateDefaultLog } from './utils/activateDefaultLog.ts';

activateDefaultLog();
attachLoggerOnNavigate();

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
