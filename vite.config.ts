import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import mkcert from 'vite-plugin-mkcert';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/',
  plugins: [
    // NOTE: 환경변수에 대한 validation / undefined = required, null = optional
    // validation 실패 시 dev 서버 / build 실행 시 오류
    EnvironmentPlugin(
      {
        VITE_DEPLOY_ENV: undefined,
        VITE_KAKAO_KEY: undefined,
        VITE_SERVER_URL: undefined,
        VITE_SENTRY_DSN: undefined,
        VITE_SENTRY_AUTH_TOKEN: undefined,
        VITE_SENTRY_ORG: undefined,
        VITE_SENTRY_PROJECT: undefined,
        VITE_HOTJAR_SITE_ID: undefined,
        VITE_HOTJAR_VERSION: undefined,
        VITE_GTM_ID: undefined,
      },
      { defineOn: 'import.meta.env' }, // NOTE: html에서도 참조하려면 필요 - process.env 대신 import.meta.env로 노출
    ),
    react(),
    svgr(),
    mkcert(),
    sentryVitePlugin({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
    }),
    tsconfigPaths(),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  define: {
    global: 'window',
  },
  server: {
    allowedHosts: ['dev-client.ittory.co.kr', 'local.ittory.co.kr'],
  },
  build: {
    // @see https://github.com/vitejs/vite/issues/19402
    assetsInlineLimit: 0,
    sourcemap: true,
    target: 'ES2022',
  },
});
