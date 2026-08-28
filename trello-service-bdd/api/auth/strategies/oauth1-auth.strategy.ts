// src/auth/strategies/oauth1-auth.strategy.ts
import { IAuthStrategy, AuthRequestData } from '../auth-strategy.interface';

export class OAuth1AuthStrategy implements IAuthStrategy {
  constructor(
    private readonly apiKey: string,
    private readonly token: string,
  ) {}

  getAuthData(_method: string, _url: string): AuthRequestData {
    return {
      headers: {
        Authorization: `OAuth oauth_consumer_key="${this.apiKey}", oauth_token="${this.token}"`,
      },
    };
  }
}
