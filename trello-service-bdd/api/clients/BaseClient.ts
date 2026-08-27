// src/api/clients/BaseClient.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

type ParamValue = string | number | boolean;

export abstract class BaseClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly authStrategy: IAuthStrategy,
  ) {}

  protected async get(
    path: string,
    extraParams: Record<string, string> = {},
  ): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('GET', path);
    return this.request.get(path, { headers, params: { ...params, ...extraParams } });
  }

  protected async post(
    path: string,
    extraParams: Record<string, string> = {},
  ): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('POST', path);
    return this.request.post(path, { headers, params: { ...params, ...extraParams } });
  }

  protected async put(
    path: string,
    extraParams: Record<string, ParamValue> = {},
  ): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('PUT', path);
    return this.request.put(path, { headers, params: this.mergeParams(params, extraParams) });
  }

  protected async delete(
    path: string,
    extraParams: Record<string, string> = {},
  ): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('DELETE', path);
    return this.request.delete(path, { headers, params: { ...params, ...extraParams } });
  }

  private buildAuth(method: string, path: string) {
    const fullUrl = `${path}`;
    return this.authStrategy.getAuthData(method, fullUrl);
  }

  private mergeParams(
    authParams: Record<string, string> | undefined,
    extraParams: Record<string, ParamValue>,
  ): Record<string, string> {
    const stringified: Record<string, string> = {};
    for (const [key, value] of Object.entries(extraParams)) {
      stringified[key] = String(value);
    }
    return { ...authParams, ...stringified };
  }
}
