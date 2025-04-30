import { SessionLogger } from './SessionLogger';

const commonErrorLogger = new SessionLogger('commonError');

export const attachLoggerOnError = () => {
  const originalConsoleError = console.error.bind(console);

  console.error = function (...args: unknown[]) {
    originalConsoleError(...args);
    commonErrorLogger.uncaughtError(...args);
  };

  window.onunhandledrejection = (event) => {
    commonErrorLogger.uncaughtError(
      'Unhandled Promise Rejection:',
      event.reason,
    );
  };

  window.onerror = (message, source, lineno, colno, error) => {
    const errorInfo = {
      message,
      source,
      lineno,
      colno,
      stack: error?.stack,
      name: error?.name,
      timestamp: new Date().toISOString(),
    };
    commonErrorLogger.uncaughtError('Global Error:', errorInfo);
  };
};
