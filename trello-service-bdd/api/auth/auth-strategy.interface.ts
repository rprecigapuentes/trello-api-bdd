// src/auth/auth-strategy.interface.ts
export interface AuthRequestData {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface IAuthStrategy {
  getAuthData(method: string, url: string): AuthRequestData;
}
