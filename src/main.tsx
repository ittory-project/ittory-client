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

activateDefaultLog();
attachLoggerOnNavigate();
attachLoggerOnError();
logBrowserInformation();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.captureConsoleIntegration({ levels: ['error'] })],
});

if (!import.meta.env.DEV) {
  // TODO: 프론트 배포 시 서버 환경 변수 설정이 가능할 때까지 유보
  const siteId = 6407654;
  const hotjarVersion = 6;
  Hotjar.init(siteId, hotjarVersion);
}

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
