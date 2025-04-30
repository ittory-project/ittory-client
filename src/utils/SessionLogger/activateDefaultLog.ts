import { SessionLogger } from './SessionLogger';

export const activateDefaultLog = () => {
  SessionLogger.enableLogLevels([
    'info',
    'warn',
    'error',
    'uncaughtError',
    'debug',
  ]);
  SessionLogger.enableFeatures([
    'nav',
    'http',
    'websocket',
    'account',
    'create',
    'home',
    'invite',
    'letterbox',
    'login',
    'share',
    'write',
    'menu',
    'commonError',
  ]);
};
