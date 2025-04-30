import { SessionLogger } from './SessionLogger';
import { formatObjectString } from './formatObjectString';

const browserInfoLogger = new SessionLogger('browserInfo');

export const logBrowserInformation = () => {
  const userAgent = navigator.userAgent;

  // @ts-expect-error 타입 정의가 없음 (Chrome only 95+)
  const chromeData = navigator.userAgentData;
  const browserWidth = window.innerWidth;
  const browserHeight = window.innerHeight;
  const browserLanguage = navigator.language;
  const realScreenWidth = window.screen.width * window.devicePixelRatio;
  const realScreenHeight = window.screen.height * window.devicePixelRatio;

  browserInfoLogger.info(`[Browser Information]
    User Agent: ${userAgent}
    Chrome Data: ${formatObjectString(chromeData)}
    Language: ${browserLanguage}
    Window Resolution: ${browserWidth} * ${browserHeight}
    Real Device Resolution: ${realScreenWidth} * ${realScreenHeight}`);
};
