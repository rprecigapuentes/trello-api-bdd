import { IAuthStrategy } from './auth-strategy.interface';
import { ParamsAuthStrategy } from './strategies/params-auth.strategy';
import { OAuth1AuthStrategy } from './strategies/oauth1-auth.strategy';

export type AuthType = 'params' | 'oauth1';

export class AuthStrategyFactory {
  static create(type: AuthType): IAuthStrategy {
    switch (type) {
      case 'params': {
        const key = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_API_TOKEN;
        if (!key || !token) {
          throw new Error('Faltan TRELLO_API_KEY o TRELLO_API_TOKEN para AUTH_TYPE=params.');
        }
        return new ParamsAuthStrategy(key, token);
      }
      case 'oauth1': {
        const key = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_API_TOKEN;
        if (!key || !token) {
          throw new Error('Faltan TRELLO_API_KEY o TRELLO_API_TOKEN para AUTH_TYPE=oauth1.');
        }
        return new OAuth1AuthStrategy(key, token);
      }
      default:
        throw new Error(`Auth type no soportado: ${type}`);
    }
  }
}
