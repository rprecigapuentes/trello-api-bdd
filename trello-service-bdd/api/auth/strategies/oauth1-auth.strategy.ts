// src/auth/strategies/oauth1-auth.strategy.ts
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { IAuthStrategy, AuthRequestData } from '../auth-strategy.interface';

export class OAuth1AuthStrategy implements IAuthStrategy {
  private readonly oauth: OAuth;
  private readonly token: OAuth.Token;

  constructor(consumerKey: string, consumerSecret: string, tokenKey: string, tokenSecret: string) {
    this.oauth = new OAuth({
      consumer: { key: consumerKey, secret: consumerSecret },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64');
      },
    });

    this.token = { key: tokenKey, secret: tokenSecret };
  }

  getAuthData(method: string, url: string): AuthRequestData {
    const requestData = { url, method };
    const authHeader = this.oauth.toHeader(this.oauth.authorize(requestData, this.token));
    return { headers: { ...authHeader } };
  }
}
