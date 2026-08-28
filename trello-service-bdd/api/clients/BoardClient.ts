import { APIRequestContext, APIResponse } from '@playwright/test';
import { TrelloBoardSchema } from '../schemas/trelloSchemas';

export class BoardClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createBoard(name: string, idOrganization?: string): Promise<APIResponse> {
    const response = await this.request.post(`/1/boards`, {
      params: idOrganization ? { name, idOrganization } : { name },
    });
    return response;
  }

  async getBoard(boardId: string): Promise<APIResponse> {
    const response = await this.request.get(`/1/boards/${boardId}`);
    return response;
  }

  async updateBoard(boardId: string, updates: Partial<TrelloBoardSchema>): Promise<APIResponse> {
    const response = await this.request.put(`/1/boards/${boardId}`, {
      params: updates,
    });
    return response;
  }

  async deleteBoard(boardId: string): Promise<APIResponse> {
    const response = await this.request.delete(`/1/boards/${boardId}`);
    return response;
  }
}
