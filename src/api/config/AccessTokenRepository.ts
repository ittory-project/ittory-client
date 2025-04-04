import { api } from './api';

/**
 * Axios, WebSocket 간에 in-memory로 Access Token을 공유하기 위해 사용
 */
declare global {
  interface Window {
    // eslint-disable-next-line
    __DEBUG__forceAccessToken: (accessToken: string) => void;
  }
}

// TODO: /api prefix를 axios 인스턴스에 공통화
export const refreshEndpoint = `${import.meta.env.VITE_SERVER_URL}/api/auth/refresh`;

export class AccessTokenRepository {
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
    if (!this.#accessToken) {
      throw new Error('Access Token이 없습니다.');
    }
    return this.#accessToken;
  }

  isRefreshing() {
    return this.#refreshRequest !== null;
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

    this.#accessToken = `Bearer ${response.data.data.accessToken}`;
  }
}

export const accessTokenRepository = AccessTokenRepository.getInstance();
