// src/api/clients/BaseClient.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

type ParamValue = string | number | boolean;
type ParamsInput = Record<string, ParamValue>;

type MultipartValue =
  string | number | boolean | { name: string; mimeType: string; buffer: Buffer };

interface RequestExtras {
  multipart?: Record<string, MultipartValue>;
  data?: unknown;
  form?: Record<string, string | number | boolean>;
}

export abstract class BaseClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly authStrategy: IAuthStrategy,
  ) {}

  protected async get(path: string, extraParams: ParamsInput = {}): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('GET', path);
    return this.request.get(path, { headers, params: this.mergeParams(params, extraParams) });
  }

  protected async post(
    path: string,
    paramsOrExtras: ParamsInput | RequestExtras = {},
  ): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('POST', path);
    const { queryParams, extras } = this.splitInput(paramsOrExtras);
    return this.request.post(path, {
      headers,
      params: this.mergeParams(params, queryParams),
      ...extras,
    });
  }

  protected async put(
    path: string,
    paramsOrExtras: ParamsInput | RequestExtras = {},
  ): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('PUT', path);
    const { queryParams, extras } = this.splitInput(paramsOrExtras);
    return this.request.put(path, {
      headers,
      params: this.mergeParams(params, queryParams),
      ...extras,
    });
  }

  protected async delete(path: string, extraParams: ParamsInput = {}): Promise<APIResponse> {
    const { headers, params } = this.buildAuth('DELETE', path);
    return this.request.delete(path, { headers, params: this.mergeParams(params, extraParams) });
  }

  private buildAuth(method: string, path: string) {
    const fullUrl = `${path}`;
    return this.authStrategy.getAuthData(method, fullUrl);
  }

  private splitInput(input: ParamsInput | RequestExtras): {
    queryParams: ParamsInput;
    extras: RequestExtras;
  } {
    const specialKeys = new Set(['multipart', 'data', 'form']);
    const queryParams: ParamsInput = {};
    const extras: RequestExtras = {};

    for (const [key, value] of Object.entries(input)) {
      if (specialKeys.has(key)) {
        (extras as Record<string, unknown>)[key] = value;
      } else {
        queryParams[key] = value as ParamValue;
      }
    }
    return { queryParams, extras };
  }

  private mergeParams(
    authParams: Record<string, string> | undefined,
    extraParams: ParamsInput,
  ): Record<string, string> {
    const stringified: Record<string, string> = {};
    for (const [key, value] of Object.entries(extraParams)) {
      stringified[key] = String(value);
    }
    return { ...authParams, ...stringified };
  }
}
