declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

// NOTE: 웹뷰 디버깅 용도 테스트
export const syncReactNativeWebViewConsole = () => {
  const logLevels = ['log', 'error', 'warn', 'info', 'debug'] as const;
  logLevels.forEach((level) => {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      original(...args);
      if (window.ReactNativeWebView?.postMessage) {
        const msg = { level, args };
        window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }
    };
  });
};
