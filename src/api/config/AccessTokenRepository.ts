import { api } from './api';

/**
 * Axios, WebSocket 간에 in-memory로 Access Token을 공유하기 위해 사용
 */
declare global {
  interface Window {
    __DEBUG__forceAccessToken: (accessToken: string) => void;
  }
}

// TODO: /api prefix를 axios 인스턴스에 공통화
export const refreshEndpoint = `${import.meta.env.VITE_SERVER_URL}/api/auth/refresh`;

type StateChangeListener = () => void;

export class AccessTokenRepository {
  #stateChangeListeners: StateChangeListener[] = [];
  #refreshRequest: Promise<void> | null = null;
  #accessToken: string | null = null;
  static #instance = new AccessTokenRepository();

  private constructor() {
    // NOTE: 디버깅 용도
    window.__DEBUG__forceAccessToken = (accessToken: string) => {
      this.#accessToken = accessToken;
    };
  }

  static getInstance() {
    if (!AccessTokenRepository.#instance) {
      AccessTokenRepository.#instance = new AccessTokenRepository();
    }
    return AccessTokenRepository.#instance;
  }

  get() {
    // NOTE: 첫 로그인 시 호출되므로 null 반환 필요
    if (!this.#accessToken) {
      return null;
    }
    return this.#accessToken;
  }

  isRefreshing() {
    return this.#refreshRequest !== null;
  }

  // NOTE: 로그인 API로 로그인 시 반환되는 AccessToken 활용
  onLogin(accessToken: string) {
    this.#setAccessToken(accessToken);
  }

  isLoggedIn() {
    return this.#accessToken !== null;
  }

  logout() {
    this.#setAccessToken(null);
  }

  // NOTE: zustand/context 의존 없이, 국소적인 분기하려면 직접 이벤트 발행해야 함
  addStageChangeListener(listener: () => void) {
    this.#stateChangeListeners.push(listener);
  }

  removeStageChangeListener(listener: () => void) {
    this.#stateChangeListeners = this.#stateChangeListeners.filter(
      (l) => l !== listener,
    );
  }

  // TODO: Sentry 등으로 오류 모니터링
  refresh() {
    if (!this.#refreshRequest) {
      this.#refreshRequest = (async () => {
        try {
          await this.#fetchNewAccessToken();
        } finally {
          this.#refreshRequest = null;
        }
      })();
    }

    return this.#refreshRequest;
  }

  #setAccessToken(accessToken: string | null) {
    this.#accessToken = accessToken ? `Bearer ${accessToken}` : null;
    this.#stateChangeListeners.forEach((listener) => listener());
  }

  async #fetchNewAccessToken() {
    const response = await api.post(
      refreshEndpoint,
      {},
      {
        headers: {
          Authorization: null,
        },
      },
    );

    this.#setAccessToken(response.data.data.accessToken);
  }
}

export const accessTokenRepository = AccessTokenRepository.getInstance();
