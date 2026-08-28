import { APIRequestContext, APIResponse } from '@playwright/test';

export class TokenClient {
  constructor(private request: APIRequestContext) {}

  async deleteToken(
    token: string,
    options?: Parameters<APIRequestContext['delete']>[1],
  ): Promise<APIResponse> {
    return await this.request.delete(`1/tokens/${token}`, options);
  }
}
