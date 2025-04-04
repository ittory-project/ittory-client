/**
 * Axios, WebSocket 간에 in-memory로 Access Token을 공유하기 위해 사용
 */
declare global {
  interface Window {
    __DEBUG__forceAccessToken: (accessToken: string) => void;
  }
}

export class AccessTokenManager {
  static #instance: AccessTokenManager | null = null;
  #accessToken: string | null = null;

  private constructor() {}

  static getInstance(): AccessTokenManager {
    if (!AccessTokenManager.#instance) {
      AccessTokenManager.#instance = new AccessTokenManager();

      // NOTE: 디버깅 용도
      window.__DEBUG__forceAccessToken = (accessToken: string) =>
        AccessTokenManager.#instance?.setAccessToken(accessToken);
    }
    return AccessTokenManager.#instance;
  }

  setAccessToken(accessToken: string): void {
    this.#accessToken = accessToken;
  }

  getAccessToken(): string | null {
    return this.#accessToken;
  }
}
