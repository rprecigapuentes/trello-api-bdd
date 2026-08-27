import { APIResponse } from '@playwright/test';
import { TrelloListSchema } from '../schemas/trelloSchemas';

import { BaseClient } from './BaseClient';

export class ListClient extends BaseClient {
  async createList(boardId: string, name: string): Promise<APIResponse> {
    const response = await this.post(`/1/lists`, { name, idBoard: boardId });
    return response;
  }

  async getList(listId: string): Promise<APIResponse> {
    const response = await this.get(`/1/lists/${listId}`);
    return response;
  }

  async updateList(listId: string, updates: Partial<TrelloListSchema>): Promise<APIResponse> {
    const response = await this.put(`/1/lists/${listId}`, updates);
    return response;
  }

  async archiveList(listId: string): Promise<APIResponse> {
    return this.updateList(listId, { closed: true });
  }
}
