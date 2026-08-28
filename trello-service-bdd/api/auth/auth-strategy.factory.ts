import { IAuthStrategy } from './auth-strategy.interface';
import { ParamsAuthStrategy } from './strategies/params-auth.strategy';
import { OAuth1AuthStrategy } from './strategies/oauth1-auth.strategy';

export type AuthType = 'params' | 'oauth1';

export class AuthStrategyFactory {
  static create(type: AuthType, apiKey: string, apiToken: string): IAuthStrategy {
    switch (type) {
      case 'params': {
        return new ParamsAuthStrategy(apiKey, apiToken);
      }
      case 'oauth1': {
        return new OAuth1AuthStrategy(apiKey, apiToken);
      }
      default:
        throw new Error(`Auth type not supported: ${type}`);
    }
  }
}
