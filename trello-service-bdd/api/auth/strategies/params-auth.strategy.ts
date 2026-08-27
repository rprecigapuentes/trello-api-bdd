// src/auth/strategies/params-auth.strategy.ts
import { IAuthStrategy, AuthRequestData } from '../auth-strategy.interface';

export class ParamsAuthStrategy implements IAuthStrategy {
  constructor(
    private readonly apiKey: string,
    private readonly token: string,
  ) {}

  getAuthData(_method: string, _url: string): AuthRequestData {
    return {
      params: {
        key: this.apiKey,
        token: this.token,
      },
    };
  }
}
