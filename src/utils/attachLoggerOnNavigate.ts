import { SessionLogger } from './SessionLogger';

const navLogger = new SessionLogger('nav');

export const attachLoggerOnNavigate = () => {
  const originalPushState = window.history.pushState;
  window.history.pushState = (...args) => {
    const extractPath = (url: string) => {
      if (url.includes(window.location.origin)) {
        return url.split(window.location.origin)[1];
      } else {
        return url;
      }
    };

    const currentLocation = window.location.pathname;
    const nextLocation = extractPath(args[2]?.toString() ?? '');
    navLogger.info(`[NAVIGATE] ${currentLocation} -> ${nextLocation}`);

    originalPushState.apply(window.history, args);
  };

  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    const extractPath = (url: string) => {
      if (url.includes(window.location.origin)) {
        return url.split(window.location.origin)[1];
      } else {
        return url;
      }
    };

    const currentLocation = window.location.pathname;
    const nextLocation = extractPath(args[2]?.toString() ?? '');
    navLogger.info(`[REPLACE] ${currentLocation} -> ${nextLocation}`);

    originalReplaceState.apply(window.history, args);
  };
};
