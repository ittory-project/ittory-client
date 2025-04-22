type LogLevel = 'info' | 'warn' | 'error' | 'debug';
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
  | 'menu';

const logLevelConsoleMap: Record<LogLevel, 'log' | 'warn' | 'error'> = {
  info: 'log',
  warn: 'warn',
  error: 'error',
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
  private logs: string[] = [];
  private static enabledFeatures: Feature[] = [];
  private static enabledLogLevels: LogLevel[] = [];

  constructor(feature: Feature) {
    this.feature = feature;
    this.loadLogs();
  }

  static {
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
    const content = rawData.join('\r\n');

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

  debug(...args: unknown[]) {
    this.log('debug', ...args);
  }

  private loadLogs() {
    const storedLogs = sessionStorage.getItem('logs');
    if (storedLogs) {
      this.logs = JSON.parse(storedLogs);
    }
  }

  private appendLog(log: string) {
    this.logs.push(log);
    sessionStorage.setItem('logs', JSON.stringify(this.logs));
  }

  private formatContent(args: unknown[]): string {
    return args
      .map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
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

    // 콘솔에 출력
    console[logLevelConsoleMap[type]](`[${type}][${this.feature}]`, ...args);
  }
}
