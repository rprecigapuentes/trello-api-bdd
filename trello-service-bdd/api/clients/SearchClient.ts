import { APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';

export class SearchClient extends BaseClient {
  async search(query: string): Promise<APIResponse> {
    const response: APIResponse = await this.get('/1/search', { query: query });
    return response;
  }
}
