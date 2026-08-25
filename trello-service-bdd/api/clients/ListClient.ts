import { APIRequestContext, APIResponse } from '@playwright/test';
import { TrelloListSchema } from '../schemas/trelloSchemas';

export class ListClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createList(boardId: string, name: string): Promise<APIResponse> {
    const response = await this.request.post(`/1/lists`, {
      params: { name, idBoard: boardId },
    });
    return response;
  }

  async getList(listId: string): Promise<APIResponse> {
    const response = await this.request.get(`/1/lists/${listId}`);
    return response;
  }

  async updateList(listId: string, updates: Partial<TrelloListSchema>): Promise<APIResponse> {
    const response = await this.request.put(`/1/lists/${listId}`, {
      params: updates,
    });
    return response;
  }

  async archiveList(listId: string): Promise<APIResponse> {
    return this.updateList(listId, { closed: true });
  }
}
