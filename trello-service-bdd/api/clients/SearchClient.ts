import { APIRequestContext, APIResponse } from '@playwright/test';

export class SearchClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async search(query: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.get('/1/search', {
      params: { query: query },
    });
    return response;
  }
}
