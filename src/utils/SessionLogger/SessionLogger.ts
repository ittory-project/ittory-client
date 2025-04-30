type LogLevel = 'info' | 'warn' | 'error' | 'uncaughtError' | 'debug';
type Feature =
  | 'nav'
  | 'http'
  | 'websocket'
  | 'account'
  | 'create'
  | 'home'
  | 'invite'
  | 'letterbox'
  | 'login'
  | 'share'
  | 'write'
  | 'menu'
  | 'commonError';

const logLevelConsoleMap: Record<LogLevel, 'log' | 'warn' | 'error'> = {
  info: 'log',
  warn: 'warn',
  uncaughtError: 'log',
  error: 'log', // console.error 자체에 이미 몽키패칭되어 있어서, 무한 루프가 발생함
  debug: 'log', // console.debug는 함수는 있으나, 동작이 없음
};

declare global {
  interface Window {
    exportSessionLogs: () => void;
  }
}

/**
 * Session(Tab) 단위로 로그를 출력하고 보관하는 Logger
 * - 새로 고침 시에도 로그 유지
 * - 로그 초기화를 위해서는 신규 탭 사용 필요
 */
export class SessionLogger {
  private feature: Feature;

  private static logs: string[] = [];
  private static enabledFeatures: Feature[] = [];
  private static enabledLogLevels: LogLevel[] = [];

  constructor(feature: Feature) {
    this.feature = feature;
  }

  static {
    const storedLogs = sessionStorage.getItem('logs');
    if (storedLogs) {
      SessionLogger.logs = JSON.parse(storedLogs);
    }

    window.exportSessionLogs = SessionLogger.exportAsTxt;
  }

  static enableFeatures(features: Feature[]) {
    this.enabledFeatures.push(...features);
  }

  static enableLogLevels(logLevels: LogLevel[]) {
    this.enabledLogLevels.push(...logLevels);
  }

  static exportAsTxt(): void {
    const rawData = JSON.parse(
      sessionStorage.getItem('logs') ?? '[]',
    ) as string[];
    const content = rawData.join('\r\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ittory_session_log_${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  info(...args: unknown[]) {
    this.log('info', ...args);
  }

  warn(...args: unknown[]) {
    this.log('warn', ...args);
  }

  error(...args: unknown[]) {
    this.log('error', ...args);
  }

  uncaughtError(...args: unknown[]) {
    this.log('uncaughtError', ...args);
  }

  debug(...args: unknown[]) {
    this.log('debug', ...args);
  }

  private appendLog(log: string) {
    SessionLogger.logs.push(log);
    sessionStorage.setItem('logs', JSON.stringify(SessionLogger.logs));
  }

  private formatContent(args: unknown[]): string {
    return args
      .map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, '\t').replace(/\\n/g, '\n');
        }
        return String(arg);
      })
      .join(' ');
  }

  private isLogEnabled(type: LogLevel): boolean {
    return (
      SessionLogger.enabledLogLevels.includes(type) &&
      SessionLogger.enabledFeatures.includes(this.feature)
    );
  }

  private log(type: LogLevel, ...args: unknown[]) {
    if (!this.isLogEnabled(type)) {
      return;
    }

    const time = new Date().toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const content = this.formatContent(args);
    const logEntry = `[${time}][${type}][${this.feature}] ${content}`;

    this.appendLog(logEntry);

    if (!this.isLogEnabled(type)) {
      return;
    }

    // thrown error는 어차피 표시되므로 생략
    if (type !== 'uncaughtError') {
      console[logLevelConsoleMap[type]](`[${type}][${this.feature}]`, ...args);
    }
  }
}
