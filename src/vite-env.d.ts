/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// NOTE: 환경 변수 타입 정의
interface ImportMetaEnv {
  VITE_DEPLOY_ENV: 'local' | 'dev' | 'prod';
  VITE_KAKAO_KEY: string;
  VITE_SERVER_URL: string;
  VITE_SENTRY_DSN: string;
  VITE_SENTRY_AUTH_TOKEN: string;
  VITE_HOTJAR_SITE_ID: string;
  VITE_HOTJAR_VERSION: string;
  VITE_GTM_ID: string;
}
